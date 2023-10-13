import express from "express";
import dotenv from "dotenv";
import postRouter from "./routes/post.js";
import userRouter from "./routes/user.js";
import cookieParser from "cookie-parser";

const app = express();

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "backend/config/config.env" });
}

// using middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// importing routes
app.use("/api/v1", postRouter);
app.use("/api/v1", userRouter);

export default app;
 