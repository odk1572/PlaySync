// index.js
import dotenv from 'dotenv';
import 'dotenv/config'
// Load environment variables from .env file
dotenv.config({path:'./.env'});

// Example function to use the environment variables
import connectDB from './db/index.js';
import { app } from './app.js';

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port : http://localhost:${process.env.PORT}`);
    })
    app.on("error",(error)=>{
        console.log("Error: ",error);
        throw error
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})