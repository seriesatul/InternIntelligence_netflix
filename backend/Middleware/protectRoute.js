import jwt from 'jsonwebtoken';
import  User  from '../Models/user.model.js';
import { ENV_VARS } from '../Config/envVars.js';

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies["jwt-netflix"]

        if (!token) {
            return res.status(401).json({ message: 'You are not authorized to access this resource', success: false });
        }

        const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({ message: 'Token is invalid', success: false });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            console.log("Decoded User ID:", decoded.userId);
            return res.status(401).json({ message: 'User not found', success: false });
        }
        

        
        req.user = user;


        next();
    } catch (error) {
        
        console.log("Error in protectRoute middleware: ", error.message);
    }
}
