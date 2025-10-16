import React, { useState } from "react";
import ChatInput from "./components/ChatInput";
import Dashboard from "./pages/Dashboard";

function App() {
  const [schedules, setSchedules] = useState([]);

  const handleNewSchedule = (newSchedule) => {
    setSchedules((prev) => [...prev, newSchedule]);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>🧠 AI 일정 도우미</h1>
      <Dashboard schedules={schedules} />
      <ChatInput onNewSchedule={handleNewSchedule} />
    </div>
  );
}

export default App;
