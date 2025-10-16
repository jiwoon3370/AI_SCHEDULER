// src/components/CalendarView.jsx
import React from "react"

export default function CalendarView({ schedules }) {
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1)

  return (
    <div className="grid grid-cols-7 gap-2">
      {daysInMonth.map((day) => (
        <div key={day} className="bg-white rounded-xl shadow-sm p-2 h-28 relative">
          <div className="text-xs text-gray-400">{day}일</div>

          {schedules
            .filter((s) => s.date && s.date.endsWith(`-${String(day).padStart(2, "0")}`))
            .map((s) => (
              <div
                key={s.id}
                className="mt-1 text-xs p-1 rounded-md truncate"
                style={{ backgroundColor: s.color }}
              >
                {s.title}
              </div>
            ))}
        </div>
      ))}
    </div>
  )
}
