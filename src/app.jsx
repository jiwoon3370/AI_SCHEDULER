import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import CalendarView from "./components/CalendarView";
import ChatBox from "./components/ChatBox";
import ChatInput from "./components/ChatInput";
import FileSection from "./components/FileSection";

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "안녕하세요! 일정이나 파일에 대해 물어보세요." },
  ]);

  useEffect(() => {
    // 기존 이벤트 로드 (백엔드가 없으면 빈 배열)
    fetch("/api/events")
      .then((r) => r.json())
      .then((d) => setSchedules(d || []))
      .catch(() => setSchedules([]));
  }, []);

  function handleNewMessage(text, role = "user") {
    setMessages((m) => [...m, { role, text }]);
  }

  function handleNewSchedule(schedule) {
    setSchedules((s) => [schedule, ...s]);
  }

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main className="flex-1 p-6">
        <div className="flex items-start gap-6">
          <section className="flex-1 bg-white rounded-xl p-6 shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Calendar</h2>
              <div>
                <button className="px-3 py-1 bg-indigo-600 text-white rounded">New</button>
              </div>
            </div>

            <CalendarView schedules={schedules} />
          </section>

          <aside className="w-[420px] flex flex-col gap-4">
            <div className="bg-white rounded-xl shadow flex-1 flex flex-col overflow-hidden">
              <ChatBox messages={messages} />
              <ChatInput
                onNewSchedule={(sch) => handleNewSchedule(sch)}
                onSend={(text) => handleNewMessage(text)}
              />
            </div>

            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="font-semibold mb-2">Files</h3>
              <FileSection />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}