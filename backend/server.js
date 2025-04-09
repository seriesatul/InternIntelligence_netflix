import express from 'express';

import movieRoutes from './Routes/movie.routes.js';
import authRoutes from './Routes/auth.routes.js';
import tvRoutes from './Routes/tv.routes.js';
import searchRoutes from './Routes/search.routes.js';
import { ENV_VARS } from './Config/envVars.js';
import { connectDB } from './Config/db.js';
import { protectRoute } from './Middleware/protectRoute.js';
import cookieParser from 'cookie-parser';
import path from "path";


const app = express();
const PORT = ENV_VARS.PORT
const __dirname = path.resolve();


// Allow frontend origin and credentials (cookies, etc.)
// app.use(cors({
//   origin: ["http://localhost:5173", "http://localhost:5174","http://localhost:5175"],
//   credentials: true
// }));





app.use(express.json());
app.use(cookieParser())

// Routes
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/movie",protectRoute, movieRoutes)
app.use("/api/v1/tv", protectRoute, tvRoutes)
app.use("/api/v1/search", protectRoute, searchRoutes);

if (ENV_VARS.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

app.listen(PORT,()=> {
    console.log('Server is running on port:'+ PORT);
    connectDB();
   
});



