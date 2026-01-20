import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import path from "path";
import http from "http";
import { initSocket } from "./src/libs/socket.js";
import routes from "./src/routes/index.js";
import helmet from "helmet";
import cookieParser from "cookie-parser";

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json({
  verify: (req, res, buf) => {
    if (req.originalUrl.includes("webhook")) {
      req.rawBody = buf.toString();
    }
  },
}));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));
app.use("/api", routes); 
app.use(helmet());

mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log("Database Connected Successfuly!"))
.catch((err)=> console.log("Error in Connecting Database: ", err))
 

//Test Route to see if app is running
app.get("/", (req, res)=> {
    res.send("Project Management App is Working!")
})

//global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong!" });
});


server.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`))
