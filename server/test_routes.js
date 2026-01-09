import express from "express";
import routes from "./src/routes/index.js";

const app = express();
app.use("/api", routes);

console.log("Routes mounted successfully");
