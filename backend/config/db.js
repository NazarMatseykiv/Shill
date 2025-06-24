import mongoose from "mongoose";
export const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://administrator:STZbC7Nvcvpq61RS@shil.xeunmt2.mongodb.net/shil').then(()=>console.log("DB Connect"));
}