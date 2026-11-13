import { useState } from "react";
import MessageList from "./components/MessageList.jsx";
import ChatInput from "./components/ChatInput.jsx";
import { USER_LIST } from "./constants.js";

const pickRandomUser = () =>
  USER_LIST[Math.floor(Math.random() * USER_LIST.length)];

const currentTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function App() {
  const [messages, setMessages] = useState([]);

  const handleSend = (text) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setMessages((prev) => [
      ...prev,
      { id, text, user: pickRandomUser(), likes: 0, time: currentTime() },
    ]);
  };

  const handleLike = (id) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === id ? { ...message, likes: message.likes + 1 } : message
      )
    );
  };

  return (
    <main className="app">
      <section className="chat">
        <h1 className="chat__header">Team Chat</h1>
        <MessageList messages={messages} onLike={handleLike} />
        <ChatInput onSend={handleSend} />
      </section>
    </main>
  );
}