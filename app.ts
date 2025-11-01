import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import generateWord from "./src/controller/generate.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "word-generator",
  });
});

app.post("/api/generate-words", generateWord);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "Not Found",
    message: `Cannot ${req.method} ${req.path}`,
  });
});

app.listen(PORT, () => {
  console.log(`Word Generator Server is running`);
});

export default app;
