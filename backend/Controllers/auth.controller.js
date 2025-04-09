import User from '../Models/user.model.js'
import { ENV_VARS } from '../Config/envVars.js';
import bcrypt from 'bcryptjs'
import  { generateTokenAndSetCookie }  from '../Utils/generateToken.js';


export async function signup(req, res) {
    try{
        const {email,password,username} = req.body;
        if(!email ||!password ||!username){
            return res.status(400).json({message: "All fields are required", success: false});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message: "Invalid email format", success: false});
        }

        if(password.length < 8){
            return res.status(400).json({message: "Password must be at least 8 characters long", success: false});
        }

        const existingUserbyEmail = await User.findOne({email});
        if(existingUserbyEmail){
            return res.status(400).json({message: "Email already exists", success: false});
        }

        const existingUserbyUsername = await User.findOne({username});
        if(existingUserbyUsername){
            return res.status(400).json({message: "Username already exists", success: false});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const PROFILE_PICS = ["/Avatar1.png", "/Avatar2.png", "/Avatar3.png"];
        const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

        const newUser = new User({
            email:email, 
            password:hashedPassword, 
            username:username,
            image: image
        });


        if(newUser){
            await newUser.save();
            generateTokenAndSetCookie(newUser._id, res);
            res.status(201).json({
                success: true, 
                user: {
                    ...newUser._doc,
                    password: ""
                }
            });
        }

       
    }catch(error){
        console.log(error.message)
        res.status(500).json({message: "Internal server error", success: false});
    }
}

export async function login(req, res) {
    console.log(req.body);
  try{
    const {email, password} = req.body;
    if(!email ||!password){
        return res.status(400).json({message: "All fields are required", success: false});
    }

    const user = await User.findOne({email});
    if(!user){
        return res.status(404).json({message: "Invalid email or password", success: false});
    }

    const isPassEqual = await bcrypt.compare(password, user.password);
    if(!isPassEqual){
        return res.status(404).json({message: "Invalid email or password", success: false});
    }

    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
        success: true,
        user:{
       ...user._doc,
        password: "",
        message: "Logged in successfully"
    }});
  }
  catch(error){
    console.log(error.message)
    console.log("JWT Secret:", ENV_VARS.JWT_SECRET);
    res.status(500).json({message: "Internal server error", success: false});
  }
}

export async function logout(req, res) {
    try {
        res.clearCookie("jwt-netflix");
        res.status(200).json({ message: "Logged out successfully", success: true });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal server error", success: false });
    }
}