import express from 'express'
import { addCart, removeCart, getCart, clearCart } from '../controllers/cartController.js'
import authMiddleware from '../middleware/auth.js'

const cartRouter = express.Router();

cartRouter.post("/add", authMiddleware, addCart)
cartRouter.post("/remove", authMiddleware, removeCart)
cartRouter.post("/get", authMiddleware, getCart)
cartRouter.post("/clear", authMiddleware, clearCart)

export default cartRouter;