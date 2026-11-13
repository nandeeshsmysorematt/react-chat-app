import { useEffect, useState } from "react";
import MessageList from "./components/MessageList.jsx";
import ChatInput from "./components/ChatInput.jsx";
import { socket } from "./socket.js";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(socket.connected);
  const [online, setOnline] = useState(0);
  const [sendError, setSendError] = useState(null);

  // Subscribe to server events while the component is mounted.
  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onHistory = (history) => setMessages(history);
    const onMessage = (message) =>
      setMessages((prev) =>
        prev.some((m) => m.id === message.id) ? prev : [...prev, message]
      );
    const onLike = ({ id, likes }) =>
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, likes } : m))
      );
    const onOnline = (count) => setOnline(count);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("chat:history", onHistory);
    socket.on("chat:message", onMessage);
    socket.on("chat:like", onLike);
    socket.on("chat:online", onOnline);
    socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("chat:history", onHistory);
      socket.off("chat:message", onMessage);
      socket.off("chat:like", onLike);
      socket.off("chat:online", onOnline);
      socket.disconnect();
    };
  }, []);

  // Publish a message; the server assigns the username and broadcasts it.
  const handleSend = (text) => {
    setSendError(null);
    socket.emit("chat:send", { text }, (response) => {
      if (!response?.ok) {
        setSendError(response?.error || "Could not send the message.");
      }
    });
  };

  const handleLike = (id) => {
    socket.emit("chat:like", { id });
  };

  return (
    <main className="app">
      <section className="chat">
        <header className="chat__header">
          <h1 className="chat__title">Team Chat</h1>
          <span className="chat__status">
            <span
              className={`status-dot${connected ? " status-dot--on" : ""}`}
              aria-hidden="true"
            />
            {connected ? `${online} online` : "Connecting…"}
          </span>
        </header>

        <MessageList messages={messages} onLike={handleLike} />

        {!connected && (
          <p className="chat__banner" role="status">
            Can't reach the server. Make sure it is running (npm run dev in the
            server folder).
          </p>
        )}
        {sendError && (
          <p className="chat__banner chat__banner--error" role="alert">
            {sendError}
          </p>
        )}

        <ChatInput onSend={handleSend} disabled={!connected} />
      </section>
    </main>
  );
}