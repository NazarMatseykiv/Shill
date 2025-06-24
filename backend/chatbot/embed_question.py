import sys
import json
from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

for line in sys.stdin:
    line = line.strip()
    if not line:
        continue
    try:
        data = json.loads(line)
        question = data.get('question', '')
        emb = model.encode([question])[0]
        print(json.dumps({'embedding': emb.tolist()}), flush=True)
    except Exception as e:
        print(json.dumps({'error': str(e)}), flush=True)
