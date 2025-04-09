import mongoose from'mongoose';
import {ENV_VARS} from './envVars.js';



export const connectDB = async () => {

    try{
        const conn = await mongoose.connect('mongodb+srv://atulchauhan:atulchauhan2885@cluster0.38olfd9.mongodb.net/netflix-db?retryWrites=true&w=majority&appName=Cluster0')
        console.log('MongoDB connected...');
    }catch(err){
        console.log("MONGO_URI is:", process.env.MONGO_URI);
        console.error("MongoDB Connection Error:"+err)
        process.exit(1);// exit the application with an error code
    }

    }