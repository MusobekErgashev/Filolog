"use client";

import { useState } from "react";

export default function AIPage() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = message;
    setMessage("");
    setChat((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      setChat((prev) => [
        ...prev,
        { role: "ai", text: data.reply || "AI javob bermadi" },
      ]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        { role: "ai", text: "Xatolik: " + err.message },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      {/* Chat oynasi */}
      <div className="h-100 overflow-y-auto border rounded-lg p-4 mb-4 bg-gray-50">
        {chat.map((c, i) => (
          <div key={i} className="mb-3">
            <b>{c.role === "user" ? "Siz:" : "AI:"}</b>
            <p>{c.text}</p>
          </div>
        ))}

        {loading && <p>AI yozmoqda...</p>}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Savolingizni yozing..."
          className="flex-1 border p-2 rounded"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white px-4 rounded"
          disabled={loading}
        >
          Yuborish
        </button>
      </div>
    </div>
  );
}