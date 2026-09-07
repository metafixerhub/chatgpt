import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import './index.css';

type Message = {
  role: "user" | "assistant";
  content: string;
};

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hasText = input.trim().length > 0;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (overrideText?: string) => {
    const textToSend = overrideText !== undefined ? overrideText : input.trim();
    if (!textToSend || isLoading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: textToSend }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Use the production backend URL provided
      const API_URL = import.meta.env.DEV 
        ? "http://localhost:3000/api/chat" 
        : "https://backend-wine-omega-60.vercel.app/api/chat";

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.message.content }]);
      } else {
        console.error("AI Error:", data.error);
        setMessages((prev) => [...prev, { role: "assistant", content: "Error: Could not fetch response." }]);
      }
    } catch (error) {
      console.error("Request failed:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Error: Network error." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleOptionClick = (text: string) => {
    setInput(text);
  };

  return (
    <>
      <div className="top">
        <div className="circle" title="Menu">
          <span className="material-symbols-outlined">menu</span>
        </div>
        <div className="circle" title="History">
          <span className="material-symbols-outlined">history</span>
        </div>
      </div>

      <div className="content">
        {messages.length === 0 ? (
          <>
            <div className="option" onClick={() => handleOptionClick("Create an image")}>
              <span className="material-symbols-outlined">image</span>
              <span>Create an image</span>
            </div>
            <div className="option" onClick={() => handleOptionClick("Write or edit")}>
              <span className="material-symbols-outlined">edit</span>
              <span>Write or edit</span>
            </div>
            <div className="option" onClick={() => handleOptionClick("Search the web")}>
              <span className="material-symbols-outlined">language</span>
              <span>Search the web</span>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`message ${msg.role === 'user' ? 'message-user' : 'message-ai'}`}
              >
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="message message-ai">
                <em>Typing...</em>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="bottom">
        <div className="input-container">
          <div className="plus" title="Add attachment">
            +
          </div>

          <input
            type="text"
            className="chat-input"
            placeholder="Ask anything"
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <div className="right">
            {hasText ? (
              <button className="send" style={{ display: "flex" }} onClick={() => sendMessage()} title="Send">
                <span className="material-symbols-outlined">arrow_upward</span>
              </button>
            ) : (
              <>
                <button className="icon mic" title="Microphone">
                  <span className="material-symbols-outlined">mic</span>
                </button>
                <button className="icon voice" title="Voice">
                  <span className="material-symbols-outlined">graphic_eq</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
