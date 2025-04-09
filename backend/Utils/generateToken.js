import jwt from 'jsonwebtoken';
import { ENV_VARS } from '../Config/envVars.js';



  

export const generateTokenAndSetCookie = (userId,res) => {
    const token = jwt.sign({ userId: userId },
         ENV_VARS.JWT_SECRET,
        { expiresIn: '15d' });

       


    res.cookie("jwt-netflix",token, {
        maxAge: 900000, // 15 days
        httpOnly: true,// protect the cookie from client side scripting
        sameSite: 'strict', // to prevent cross-site request forgery attacks
        secure: ENV_VARS.NODE_ENV !== "development", // only send the cookie over HTTPS
    });
    return token;
};