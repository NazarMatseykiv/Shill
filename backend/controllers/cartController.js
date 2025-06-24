// clear cart
const clearCart = async (req, res) => {
    try {
        const userId = req.body.userId;
        await userModel.findByIdAndUpdate(userId, { cardData: {} });
        res.json({ success: true, message: "Cart cleared" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}
import userModel from "../models/userModel.js"

// add item
const addCart = async(req, res) =>{
    try {
        let userData = await userModel.findOne({_id:req.body.userId});
        let cardData = await userData.cardData;
        if(!cardData[req.body.itemId])
        {
            cardData[req.body.itemId] = 1;
        }
        else{
            cardData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cardData});
        res.json({success:true, message:"Added to Cart"});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

// remove item
const removeCart = async(req, res) =>{
    try {
        let userData = await userModel.findById(req.body.userId);
        let cardData = await userData.cardData;
        if(cardData[req.body.itemId]>0)
            {
                cardData[req.body.itemId] -=1;
            }
            await userModel.findByIdAndUpdate(req.body.userId,{cardData});
            res.json({success:true, message:"Remove Cart"})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

// get cart
const getCart = async(req, res) =>{
    try {
        let userData = await userModel.findById(req.body.userId);
        let cardData = await userData.cardData;
        res.json({success:true, cardData})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
    
}

export {addCart,removeCart,getCart,clearCart}