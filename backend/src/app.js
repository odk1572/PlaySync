import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";



const app = express();

const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'https://playsync-1-7xxc.onrender.com', // Allow frontend origin
    credentials: true, // Allow cookies and credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
const __dirname = path.resolve();
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use((req, res, next) => {
    const token = req.token; // Retrieve token from authentication middleware
    const refreshToken = req.refreshToken; // Retrieve refreshToken from authentication middleware
  
    if (token) {
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Secure in production (HTTPS)
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // 'None' for cross-origin in production
            maxAge: 1000 * 60 * 15, // 15 minutes
        });
    }
  
    if (refreshToken) {
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            maxAge: 1000 * 60 * 60 * 24 * 10, // 10 days
        });
    }

    next();
});

import healthcheckRouter from './routes/healthcheck.routes.js';
import userRouter from './routes/user.routes.js';
import tweetRouter from "./routes/tweet.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import videoRouter from "./routes/video.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";

app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use(express.static(path.join(__dirname,"/Frontend/dist")));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"));
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

export { app };
