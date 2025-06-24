import json
from sentence_transformers import SentenceTransformer

with open('ukrainian_dialogs.jsonl', 'r', encoding='utf-8') as f:
    dialogs = [json.loads(line) for line in f if line.strip()]

model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

questions = [d['question'] for d in dialogs]
embeddings = model.encode(questions, show_progress_bar=True)

with open('faq_embeddings.json', 'w', encoding='utf-8') as f:
    json.dump({
        'questions': questions,
        'embeddings': [emb.tolist() for emb in embeddings]
    }, f, ensure_ascii=False, indent=2)

print('Embeddings saved to faq_embeddings.json')
