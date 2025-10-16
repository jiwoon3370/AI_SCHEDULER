import React from "react";

export default function Dashboard({ schedules }) {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">📅 일정 목록</h2>
      {schedules.length === 0 ? (
        <p>아직 일정이 없습니다.</p>
      ) : (
        <ul>
          {schedules.map((item, index) => (
            <li key={index}>
              <strong>{item.date}</strong> — {item.content}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
