import express from "express";
import cors from "cors";
import { connectDB } from "./db";
import orderRoutes from "./routes/order.routes";

export const app = express();

app.use(cors());
app.use(express.json());

connectDB();
app.use("/api", orderRoutes);
