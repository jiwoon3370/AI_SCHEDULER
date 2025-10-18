// server/index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch";
import multer from "multer";
import helmet from "helmet";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ 미들웨어
app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: [
    "https://ai-scheduler.netlify.app", // ✅ Netlify 도메인
    "http://localhost:5173"
  ],
  methods: ["GET", "POST"],
}));

// ✅ 파일 업로드용 multer 설정
const upload = multer({ storage: multer.memoryStorage() });

// ✅ 기본 라우트
app.get("/", (req, res) => {
  res.send("AI Scheduler backend is running ✅");
});

// ✅ AI 요청 처리 예시
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("❌ Chat API Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ 파일 업로드 예시 (선택사항)
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded.");
  console.log("📁 File received:", req.file.originalname);
  res.json({ message: "File uploaded successfully!" });
});

// ✅ 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
