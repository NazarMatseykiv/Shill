const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        const order = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order) return res.json({ success: false, message: 'Order not found' });
        res.json({ success: true, order });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error' });
    }
}
function generateOrderNumber() {
    return (
        Math.floor(100000 + Math.random() * 900000).toString() +
        Math.floor(1000 + Math.random() * 9000).toString()
    );
}
const createOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        let orderNumber;
        let unique = false;
        while (!unique) {
            orderNumber = generateOrderNumber();
            const exists = await orderModel.findOne({ orderNumber });
            if (!exists) unique = true;
        }
        const order = new orderModel({ userId, items, amount, address, orderNumber });
        await order.save();
        res.json({ success: true, orderId: order.orderNumber });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const userOrder = async (req, res) =>{
    try {
        const order = await orderModel.find({userId:req.body.userId});
        res.json({success:true, data:order}) 
    } catch (error) {
        console.log(error)
        res.json({success:false, message:"Error"})
    }
}

const listOrder = async (req,res) =>{
    try {
        const order = await orderModel.find({});
        res.json({success:true, data:order}) 
    } catch (error) {
        console.log(error)
        res.json({success:false, message:"Error"})
    }
}
export {userOrder, listOrder, createOrder, updateOrderStatus}