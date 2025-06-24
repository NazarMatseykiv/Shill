import express from 'express'
import authMiddleware from '../middleware/auth.js'
import { getRecommendedFoods } from '../ai/recommendation.js'

const recommendRouter = express.Router()

recommendRouter.get('/recommendations', authMiddleware, async (req, res) => {
    try {
        const userId = req.body.userId
        const foods = await getRecommendedFoods(userId)
        res.json({ success: true, data: foods })
    } catch (e) {
        res.json({ success: false, message: 'Error', error: e.message })
    }
})

export default recommendRouter
