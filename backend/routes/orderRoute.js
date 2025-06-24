import express from 'express'
import authMiddleware from '../middleware/auth.js';
import { userOrder, listOrder, createOrder, updateOrderStatus } from '../controllers/orderController.js';

const orderRouter = express.Router();
orderRouter.post('/update-status', updateOrderStatus)
orderRouter.post('/create', authMiddleware, createOrder)
orderRouter.post("/userorder", authMiddleware, userOrder)
orderRouter.get('/list',listOrder)

export default orderRouter;