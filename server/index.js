import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📁 파일 업로드 경로
const upload = multer({ dest: "uploads/" });

// 📅 일정 저장 파일
const calendarFile = path.join(process.cwd(), "calendar.json");

// ⚙️ Mistral API 설정
const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// ✅ 기본 루트 확인용
app.get("/", (req, res) => {
  res.send("✅ AI Scheduler Server Running");
});

// ✅ 채팅 메시지 분석 (AI)
app.post("/api/analyze", async (req, res) => {
  try {
    const { message } = req.body;
    console.log("📩 받은 메시지:", message);

    const response = await client.chat.completions.create({
      model: "mistralai/devstral-small-2505:free",
      messages: [
        {
          role: "system",
          content:
            "너는 일정 인식 비서야. 사용자의 문장에서 날짜와 일정 내용을 추출해 JSON 형식으로 대답해. 예: { 'date': '2025-10-14', 'content': '회의' }",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const aiText = response.choices?.[0]?.message?.content || "{}";
    console.log("🧠 인식 결과:", aiText);
    res.json({ result: aiText });
  } catch (error) {
    console.error("Mistral 호출 실패:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ 파일 업로드 및 분류
app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  let type = "기타";

  if (file.mimetype.includes("image")) type = "이미지";
  else if (file.mimetype.includes("pdf")) type = "PDF 문서";
  else if (file.mimetype.includes("text")) type = "텍스트 파일";
  else if (file.mimetype.includes("video")) type = "동영상";

  res.json({
    filename: file.originalname,
    type,
    path: file.path,
  });
});

// ✅ 일정 추가
app.post("/api/add-event", (req, res) => {
  const { date, content } = req.body;
  if (!date || !content)
    return res.status(400).json({ error: "date와 content 필요" });

  let data = [];
  if (fs.existsSync(calendarFile)) {
    data = JSON.parse(fs.readFileSync(calendarFile, "utf-8"));
  }

  const newEvent = { id: Date.now(), date, content };
  data.push(newEvent);
  fs.writeFileSync(calendarFile, JSON.stringify(data, null, 2));

  res.json({ success: true, event: newEvent });
});

// ✅ 일정 전체 불러오기
app.get("/api/events", (req, res) => {
  if (!fs.existsSync(calendarFile)) return res.json([]);
  const data = JSON.parse(fs.readFileSync(calendarFile, "utf-8"));
  res.json(data);
});

// ✅ 서버 실행
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중 (PORT ${PORT})`);
});