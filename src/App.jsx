import "./App.css";
import axios from "axios";
import React, { useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  async function generateAnswer() {
    if (!question.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: question }]);
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        method: "POST",
        data: {
          contents: [
            {
              parts: [{ text: question }],
            },
          ],
        },
      });

      const aiResponse =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response";

      setMessages((prev) => [...prev, { sender: "ai", text: aiResponse }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Error fetching response." },
      ]);
    }

    setLoading(false);
    setQuestion("");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500/30 via-blue-500/30 to-pink-500/30 p-4">
      <div className="w-full max-w-2xl h-[80vh] flex flex-col backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-white text-center mb-4 drop-shadow">
          ChatBot
        </h1>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 p-2 scrollbar-thin scrollbar-thumb-white/20">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md px-4 py-2 rounded-xl shadow-md ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : "bg-white/20 text-gray-600 border border-white/10 backdrop-blur-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-xs md:max-w-md px-4 py-2 rounded-xl bg-white/20 text-white border border-white/10 backdrop-blur-sm">
                Typing...
              </div>
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="mt-4 flex items-center gap-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generateAnswer()}
            className="flex-1 p-3 rounded-xl bg-white/10 text-gray-600 border border-white/20 placeholder-gray-700 outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Type your message..."
          />
          <button
            onClick={generateAnswer}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-400 to-blue-400 text-white font-semibold shadow-lg hover:opacity-90 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
