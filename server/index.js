import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import http from "http";
import { initSocket } from "./src/libs/socket.js";
import routes from "./src/routes/index.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));
app.use("/api", routes); 

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
