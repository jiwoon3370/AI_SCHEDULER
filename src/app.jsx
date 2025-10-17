import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function App() {
  const [message, setMessage] = useState("");
  const [events, setEvents] = useState([]);
  const [fileInfo, setFileInfo] = useState(null);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then(setEvents)
      .catch(() => setEvents([]));
  }, []);

  // ✉️ AI 분석 요청
  async function analyzeMessage() {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    alert("AI 분석 결과:\n" + JSON.stringify(data.result, null, 2));
  }

  // 📂 파일 업로드
  async function handleFileUpload(e) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setFileInfo(data);
  }

  // 🗓️ 일정 추가
  async function addEvent() {
    const date = prompt("날짜 입력 (YYYY-MM-DD)");
    const content = prompt("일정 내용 입력");
    const res = await fetch("/api/add-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, content }),
    });
    const data = await res.json();
    if (data.success) {
      alert("✅ 일정 추가 완료!");
      setEvents((prev) => [...prev, data.event]);
    }
  }

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">📅 AI SCHEDULER</h1>

      <div className="flex gap-4 mb-4">
        <input
          className="border p-2 flex-1"
          placeholder="메시지를 입력하세요"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={analyzeMessage} className="bg-blue-500 text-white px-4 rounded">
          AI 분석
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <input type="file" onChange={handleFileUpload} />
        <button onClick={addEvent} className="bg-green-500 text-white px-4 rounded">
          일정 추가
        </button>
      </div>

      {fileInfo && (
        <div className="bg-gray-100 p-2 rounded mb-4">
          <strong>📂 파일 분류 결과:</strong>
          <p>이름: {fileInfo.filename}</p>
          <p>유형: {fileInfo.type}</p>
        </div>
      )}

      <Calendar
        className="border rounded-lg p-2"
        tileContent={({ date }) => {
          const hasEvent = events.find(
            (e) => e.date === date.toISOString().split("T")[0]
          );
          return hasEvent ? <span className="text-blue-600 text-xs">●</span> : null;
        }}
      />
    </div>
  );
}

export default App;