import { useState } from "react";
import MessageList from "./components/MessageList.jsx";
import ChatInput from "./components/ChatInput.jsx";
import { USER_LIST } from "./constants.js";

const pickRandomUser = () =>
  USER_LIST[Math.floor(Math.random() * USER_LIST.length)];

export default function App() {
  const [messages, setMessages] = useState([]);

  const handleSend = (text) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setMessages((prev) => [...prev, { id, text, user: pickRandomUser() }]);
  };

  return (
    <main className="app">
      <h1 className="app__title">Team Chat</h1>
      <section className="chat">
        <MessageList messages={messages} />
        <ChatInput onSend={handleSend} />
      </section>
    </main>
  );
}