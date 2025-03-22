import { useState } from "react"

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "너는 이 사용자의 오랜 말동무야. 말을 분석하거나 해결하려 들지 않고, 감정의 흐름을 이해하며 함께 걸어가. 상대방의 말투, 표현 방식, 지금까지의 흐름을 바탕으로 조용하고 진심 어린 반응을 해. 짧지만 무게 있는 말로 반응해 줘."
    }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return
    const newMessages = [...messages, { role: "user", content: input }]
    setMessages(newMessages)
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      })
      const data = await res.json()
      setMessages([...newMessages, { role: "assistant", content: data.reply }])
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "응답을 받을 수 없었어." }])
    }
    setLoading(false)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", padding: 16, background: "#f3f3f3" }}>
      <div style={{ height: "50%, display: "flex", flexDirection: "column" }}>
        {messages
          .filter((m) => m.role !== "system")
          .map((msg, i) => (
            <div
              key={i}
              style={{
                maxWidth: "60%",
                padding: "8px 12px",
                margin: "4px 0",
                borderRadius: 16,
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                background: msg.role === "user" ? "#ffffff" : "#dddddd"
              }}
            >
              {msg.content}
            </div>
          ))}
        {loading && (
          <div
            style={{
              alignSelf: "flex-start",
              background: "#dddddd",
              padding: "8px 12px",
              borderRadius: 16,
              margin: "4px 0",
              maxWidth: "60%"
            }}
          >
            ...
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="여기에 써보세요"
        />
        <button
          style={{ padding: "8px 16px", background: "#333", color: "#fff", borderRadius: 8 }}
          onClick={handleSend}
        >
          보내기
        </button>
      </div>
    </div>
  )
}