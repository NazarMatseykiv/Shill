import express from 'express';
import { findAnswer } from './chatbot.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }
  try {
    const answer = await findAnswer(question);
    res.json({ answer });
  } catch (err) {
    res.json({ answer: 'Вибачте, сталася помилка на сервері.' });
  }
});

export default router;