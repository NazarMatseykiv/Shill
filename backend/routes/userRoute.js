import express from "express"
import { loginUser, registerUser, toggleFavorite, getFavorites } from "../controllers/userController.js"

const userRouter = express.Router()


userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/favorite", toggleFavorite)
userRouter.get("/favorites", getFavorites)


export default userRouter;