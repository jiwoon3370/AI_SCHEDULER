// src/components/ChatBox.jsx
import React from "react"

export default function ChatBox({ messages }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm text-gray-700">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`px-3 py-2 rounded-lg max-w-[80%] ${
              msg.role === "user"
                ? "bg-blue-500 text-white rounded-br-none"
                : "bg-gray-200 text-gray-800 rounded-bl-none"
            }`}
          >
            {msg.text}
          </div>
        </div>
      ))}
    </div>
  )
}
