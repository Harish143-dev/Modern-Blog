import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import router from "./routes/user.route";
import blogRouter from "./routes/blog.route";

dotenv.config();

const app: Application = express();

// connect database
connectDB();

// middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.use("/api/auth", router);
app.use("/api/blogs", blogRouter);

export default app;
