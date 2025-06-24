from fastapi import FastAPI, Query
from sentence_transformers import SentenceTransformer, util
from fastapi.middleware.cors import CORSMiddleware
import json
import torch

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = SentenceTransformer('G:/IV/Pro/search/finetuned-search')

with open('G:/IV/Pro/shil/ukrainian_dishes_dataset.json', encoding='utf-8') as f:
    data = json.load(f)

categories = [item['category'] for item in data]
ingredients = [item['ingredients'] for item in data]

category_embeddings = model.encode(categories, convert_to_tensor=True)
category_embeddings = util.normalize_embeddings(category_embeddings)

def keyword_search(query: str, top_n: int = 5):
    query = query.lower()
    matches = []
    for i, cat in enumerate(categories):
        if query in cat.lower():
            matches.append({
                'category': cat,
                'ingredients': ingredients[i],
                'score': 1.0
            })
    return matches[:top_n]

def semantic_search(query: str, top_n: int = 5):

    query_emb = model.encode(query, convert_to_tensor=True)
    def normalize(x):
        if len(x.shape) == 1:
            return torch.nn.functional.normalize(x, p=2, dim=0)
        else:
            return torch.nn.functional.normalize(x, p=2, dim=1)

    norm_category_embeddings = normalize(category_embeddings)
    norm_query_emb = normalize(query_emb)
    cos_scores = util.cos_sim(norm_query_emb, norm_category_embeddings)

    if len(categories) == 1:
        score = float(cos_scores.flatten()[0])
        return [{
            'category': categories[0],
            'ingredients': ingredients[0],
            'score': score
        }]
    else:
        cos_scores = cos_scores[0] if len(cos_scores.shape) > 1 else cos_scores
        top_results = cos_scores.topk(top_n)
        results = []
        for score, idx in zip(top_results.values, top_results.indices):
            results.append({
                'category': categories[int(idx)],
                'ingredients': ingredients[int(idx)],
                'score': float(score)
            })
        return results

def hybrid_search(query: str, top_n: int = 5):
    keyword_results = keyword_search(query, top_n * 2)
    seen = set(r['category'] for r in keyword_results)

    if len(keyword_results) >= top_n:
        return keyword_results[:top_n]

    remaining = top_n - len(keyword_results)
    semantic_results = semantic_search(query, top_n=top_n * 3)
    filtered = [r for r in semantic_results if r['category'] not in seen]
    results = keyword_results + filtered[:remaining]
    if not results and categories:
        return [{
            'category': categories[0],
            'ingredients': ingredients[0],
            'score': 1.0
        }]
    return results

@app.get("/search")
def search_dish(query: str = Query(..., description="Назва або ключові слова страви"), top_n: int = 5):
    return hybrid_search(query, top_n)
