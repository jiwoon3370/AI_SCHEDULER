import React, { useState } from "react";

function ChatInput({ onNewSchedule }) {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) throw new Error("서버 요청 실패");

      const data = await res.json();
      setResponse(data.reply);

      if (data.schedule) onNewSchedule(data.schedule);
    } catch (err) {
      console.error(err);
      setResponse("⚠️ 서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="메시지를 입력하세요..."
        rows={3}
        style={{
          width: "100%",
          padding: "0.5rem",
          borderRadius: "0.5rem",
          border: "1px solid #ccc",
        }}
      />
      <button
        onClick={handleSend}
        disabled={loading}
        style={{
          marginTop: "0.5rem",
          padding: "0.5rem 1rem",
          borderRadius: "0.5rem",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
        }}
      >
        {loading ? "보내는 중..." : "보내기"}
      </button>

      {response && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            backgroundColor: "#f7f7f7",
            borderRadius: "0.5rem",
          }}
        >
          <strong>AI 응답:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default ChatInput;
