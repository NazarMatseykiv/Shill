import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const dialogsPath = path.join(process.cwd(), 'chatbot', 'ukrainian_dialogs.jsonl');
const embeddingsPath = path.join(process.cwd(), 'chatbot', 'faq_embeddings.json');

const dialogs = fs.readFileSync(dialogsPath, 'utf-8')
  .split('\n')
  .filter(Boolean)
  .map(line => JSON.parse(line));

const { questions, embeddings } = JSON.parse(fs.readFileSync(embeddingsPath, 'utf-8'));

function cosineSimilarity(a, b) {
  let dot = 0.0, normA = 0.0, normB = 0.0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function embedQuestion(question) {
  return new Promise((resolve, reject) => {
    const py = spawn('python', [path.join(process.cwd(), 'chatbot', 'embed_question.py')]);
    let result = '';
    let error = '';
    py.stdout.on('data', (data) => { result += data.toString(); });
    py.stderr.on('data', (data) => { error += data.toString(); });
    py.on('close', (code) => {
      if (code !== 0 || error) {
        reject(error || 'Python process error');
      } else {
        try {
          const parsed = JSON.parse(result);
          if (parsed.embedding) resolve(parsed.embedding);
          else reject(parsed.error || 'No embedding');
        } catch (e) {
          reject('Failed to parse Python output');
        }
      }
    });
    py.stdin.write(JSON.stringify({ question }) + '\n');
    py.stdin.end();
  });
}

export async function findAnswer(userMessage) {
  let userEmbedding;
  try {
    userEmbedding = await embedQuestion(userMessage);
  } catch (err) {
    console.error('Embedding error:', err);
    return 'Вибачте, сталася помилка на сервері.';
  }
  let bestIdx = 0;
  let bestScore = -0.75;
  for (let i = 0; i < embeddings.length; i++) {
    const score = cosineSimilarity(userEmbedding, embeddings[i]);
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }
  if (bestScore > 0.72) {
    return dialogs[bestIdx].answer;
  }
  return 'Вибачте, я не знайшов відповіді на це питання.';
}
