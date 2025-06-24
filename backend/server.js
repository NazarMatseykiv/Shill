import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import recommendRouter from "./routes/recommendRoute.js"
import chatbotRouter from "./chatbot/chatbotRoute.js";

// app config
const app = express()
const port = 4000

// middleware
app.use(express.json())
app.use(cors())

// db connect
connectDB();


// api endpoint
app.use("/api/food", foodRouter)
app.use("/images", express.static('uploads'))
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)


app.use("/api/order", orderRouter)
app.use("/api", recommendRouter)
app.use("/api/chatbot", chatbotRouter);

app.get("/", (req, res)=>{
    res.send("API")
})

app.listen(port,()=>{
    console.log("Server Start")
})
