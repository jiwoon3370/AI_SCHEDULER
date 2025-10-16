import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_KEY) {
  console.error("❌ OPENROUTER_API_KEY가 없습니다. .env 확인!");
  process.exit(1);
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function safeParseJsonFromText(raw) {
  if (!raw) return null;
  const m = raw.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try {
    return JSON.parse(m[0]);
  } catch {
    return null;
  }
}

async function callOpenRouter(prompt, model) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENROUTER_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "너는 JSON만 출력하는 일정 분석 도우미야." },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${txt}`);
  }
  const data = await res.json();
  const raw = data?.choices?.[0]?.message?.content ?? "";
  return { raw, data };
}

async function extractSchedule(message) {
  const today = todayISO();
  const prompt = `
오늘은 ${today}입니다.
다음 문장에서 날짜와 일정을 JSON으로 반환하세요.
형식: {"date":"YYYY-MM-DD","content":"일정내용"}
"내일", "모레", "다음주" 등은 실제 날짜로 변환하세요.
문장: "${message}"
`;

try {
  const { raw } = await callOpenRouter(prompt, "mistralai/devstral-small-2505:free");
  const parsed = safeParseJsonFromText(raw);
  if (parsed && (parsed.date || parsed.content)) return parsed;
  console.warn("Mistral 응답이 JSON 아님/비어있음:", raw);
} catch (err) {
  console.warn("Mistral 호출 실패:", err.message);
}

  return { date: null, content: null };
}

app.post("/api/chat", async (req, res) => {
  const message = req.body?.message || "";
  console.log("📩 받은 메시지:", message);

  try {
    const result = await extractSchedule(message);
    console.log("🧠 인식 결과:", result);

    if (result.date && result.content) {
      res.json({
        reply: `${result.date}에 '${result.content}' 일정이 추가되었습니다!`,
        schedule: result,
      });
    } else {
      res.json({
        reply: "메시지 받았어요! 일정으로 인식되지 않았습니다.",
        schedule: null,
      });
    }
  } catch (err) {
    console.error("❌ 서버 오류:", err);
    res.status(500).json({ error: "server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ 서버 실행 중 (PORT ${PORT})`));
