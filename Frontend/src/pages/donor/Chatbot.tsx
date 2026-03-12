import { useState, useRef, useEffect, KeyboardEvent } from "react";

type Message = {
  sender: "user" | "bot";
  text: string;
};

export default function Chatbot() {
  const [open, setOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChat = (): void => setOpen(prev => !prev);

  const sendMessage = async (): Promise<void> => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    const messageToSend = input;
    setInput("");

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSend }),
      });

      const data: { reply: string } = await res.json();
      const botMessage: Message = { sender: "bot", text: data.reply };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Sorry, something went wrong." },
      ]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>
      {/* Chatbot Circle Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-red-600 text-white text-2xl shadow-lg flex items-center justify-center z-50"
      >
        💉
      </button>

      {/* Chat Popup */}
      {open && (
        <div className="fixed bottom-24 right-8 w-80 h-[500px] bg-white rounded-xl shadow-xl flex flex-col overflow-hidden z-50">
          {/* Header */}
          <div className="bg-red-600 text-white p-3 text-center font-semibold">
            Blood Donation Assistant
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[80%] p-2 rounded-xl break-words ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-200 text-black self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="flex p-3 gap-2 border-t border-gray-300">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question..."
              className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <button
              onClick={sendMessage}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}