import fs from 'fs';
import path from 'path';

const dialogsPath = path.join(process.cwd(), 'chatbot', 'ukrainian_dialogs.jsonl');
const dialogs = fs.readFileSync(dialogsPath, 'utf-8')
  .split('\n')
  .filter(Boolean)
  .map(line => JSON.parse(line));

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[.,!?;:()\[\]{}"'`~@#$%^&*_+=<>\\/\|№—–-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function jaccardSimilarity(a, b) {
  const setA = new Set(a.split(/\s+/));
  const setB = new Set(b.split(/\s+/));
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

function findBestMatch(userMessage) {
  const normUser = normalize(userMessage);
  let found = dialogs.find(d => normalize(d.question) === normUser);
  if (found) return found.answer;

  let best = null;
  let bestScore = 0;
  for (const d of dialogs) {
    const score = jaccardSimilarity(normUser, normalize(d.question));
    if (score > bestScore) {
      bestScore = score;
      best = d;
    }
  }
  if (best && bestScore > 0.3) return best.answer;

  return 'Вибачте, я немаю відповіді на це запитання, зверніться до оператора.';
}

import { spawn } from 'child_process';

function generateWithModel(userMessage) {
  return new Promise((resolve, reject) => {
    const pythonPath = 'python';
    const scriptPath = path.join(process.cwd(), 'chatbot', 'chatbot.py');
    let result = '';
    let error = '';

    const py = spawn(pythonPath, [scriptPath]);
    py.stdout.on('data', (data) => {
      result += data.toString();
    });
    py.stderr.on('data', (data) => {
      error += data.toString();
      console.log('PYTHON STDERR:', data.toString());
    });
    py.on('close', (code) => {
      if (code !== 0 || error) {
        reject(error || 'Python process error');
      } else {
        try {
          const parsed = JSON.parse(result);
          resolve(parsed.answer);
        } catch (e) {
          reject('Failed to parse Python output');
        }
      }
    });
    py.stdin.write(JSON.stringify({ question: userMessage }) + '\n');
    py.stdin.end();
  });
}

export async function findAnswer(userMessage) {
  const datasetAnswer = findBestMatch(userMessage);
  if (datasetAnswer && !datasetAnswer.startsWith('Вибачте, я немаю')) return datasetAnswer;
  try {
    return await generateWithModel(userMessage);
  } catch (err) {
    console.error('Error in findAnswer:', err);
    return 'Вибачте, не знайдено відповіді на ваше запитання.';
  }
}