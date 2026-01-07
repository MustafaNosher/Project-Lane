import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
// import routes from "./src/routes/index.js"

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log("Database Connected Successfuly!"))
.catch((err)=> console.log("Error in Connecting Database: ", err))
 

//Test Route to see if app is running
app.get("/", (req, res)=> {
    res.send("Project Management App is Working!")
})

app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`))
