import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"


const loginUser = async(req, res)=>{
    const { email, password } = req.body;
    console.log("Login attempt:", { email, password });
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            console.log("User not found:", email);
            return res.json({ success: false, message: "User doesn't exist" });
        }
        console.log("User found:", user);
        console.log("Stored password hash:", user.password);
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match result:", isMatch);
        if (!isMatch) {
            console.log("Invalid password for user:", email);
            return res.json({ success: false, message: "Invalid!" });
        }
        const token = createToken(user._id);
        console.log("Login successful for user:", email);
        res.json({ success: true, token });
    } catch (error) {
        console.error("Error during login:", error);
        res.json({ success: false, message: "Error" });
    }
}
    const createToken = (id) =>{
        return jwt.sign({id},process.env.JWT_SECRET)
    }
const registerUser = async(req, res)=>{
    const {name,password,email} = req.body;
    try {
        // check user
        const exists = await userModel.findOne({email});
        if(exists)
            {
                return res.json({success:false,message:"User already exists"})
            }
        // validate email
        if(!validator.isEmail(email)){
            return res.json({success:false, message:"Please enter a valid email"})
        }
        if(password.length<8)
            {
            return res.json({success:false, message:"Please enter a strong password"})
            }

        // hash pass
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })
        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success:true, token});
    } catch (error) {
        console.log(error)
        res.json({success:false, message:"Error"})
    }
}
const toggleFavorite = async (req, res) => {
    try {
        const { userId, foodId } = req.body;
        if (!userId || !foodId) return res.json({ success: false, message: "Missing userId or foodId" });
        const user = await userModel.findById(userId);
        if (!user) return res.json({ success: false, message: "User not found" });
        const index = user.favorites.indexOf(foodId);
        if (index === -1) {
            user.favorites.push(foodId);
        } else {
            user.favorites.splice(index, 1);
        }
        await user.save();
        res.json({ success: true, favorites: user.favorites });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const getFavorites = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.json({ success: false, message: "Missing userId" });
        const user = await userModel.findById(userId);
        if (!user) return res.json({ success: false, message: "User not found" });
        res.json({ success: true, favorites: user.favorites });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export { loginUser, registerUser, toggleFavorite, getFavorites };