import express from 'express'
import { getBotAnswer } from '../chatbot/chatbot.js'

const chatbotRouter = express.Router()

chatbotRouter.post('/chatbot', async (req, res) => {
  try {
    const { message } = req.body
    if (!message) return res.json({ success: false, answer: 'Питання не надійшло.' })
    const answer = getBotAnswer(message)
    res.json({ success: true, answer })
  } catch (e) {
    console.error('Chatbot error:', e)
    res.status(500).json({ success: false, answer: 'Внутрішня помилка сервера: ' + e.message })
  }
})

export default chatbotRouter
