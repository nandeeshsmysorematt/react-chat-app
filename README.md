# React Chat App

A real-time chat application built with **React** (Vite) and an **Express + Socket.IO** server, created for the Exact Space React assignment.

## Features

**Basic task**
- Text box and Send button (Enter also sends); empty messages are ignored
- Messages appear in a thread above the input, auto-scrolling to the newest
- Each message gets a random username from `["Alan", "Bob", "Carol", "Dean", "Elin"]`
- Like button at the right end of every message, with a count next to it

**Stretch goals (all three)**
1. **Emoji** – emoji picker button that inserts an emoji at the cursor
2. **@mentions** – typing `@` lists the users; the list filters as you type and supports mouse and keyboard (↑ ↓ Enter/Tab/Esc); mentions are highlighted in sent messages
3. **Socket.IO** – an Express server that publishes and subscribes to chat events, so messages and likes sync live across browser tabs

**Extras**
- Message history kept on the server and sent to new clients
- Online user count and connection status in the header
- Offline banner and disabled Send button when the server is unreachable (auto-reconnects)
- Server-side validation (1–500 characters per message)
- Per-user colours, avatars and timestamps

## Tech stack
- **Client:** React 18, Vite 5, socket.io-client, plain CSS
- **Server:** Node.js, Express, Socket.IO, cors

## Getting started

Requires **Node.js 18+** (https://nodejs.org).

```bash
git clone https://github.com/nandeeshsmysorematt/react-chat-app.git
cd react-chat-app
npm install        # installs the root tool plus the server and client
npm run dev        # starts the server (port 4000) and the client (port 5173)
```

Open http://localhost:5173 in two browser tabs and chat between them.

To run the parts separately: `npm run dev:server` and `npm run dev:client`.

### Configuration (optional)
| Variable | Where | Default | Purpose |
|---|---|---|---|
| `PORT` | server | `4000` | Server port |
| `CLIENT_ORIGIN` | server | `http://localhost:5173,http://127.0.0.1:5173` | Allowed browser origins (comma-separated) |
| `VITE_SERVER_URL` | client | `http://localhost:4000` | Socket.IO server URL |

## Project structure
```
react-chat-app/
  package.json            root scripts (install both, run both)
  client/                 React + Vite app
    src/
      App.jsx             socket subscriptions and chat state
      socket.js           Socket.IO client instance
      mentions.js         finds the @query being typed
      constants.js        users, colours, emojis
      components/
        ChatInput.jsx     text box, send, emoji and mention handling
        EmojiPicker.jsx   emoji panel
        MentionList.jsx   @mention suggestions
        MessageList.jsx   message thread
        MessageText.jsx   message text with highlighted mentions
        LikeButton.jsx    like button with count
  server/
    index.js              Express + Socket.IO server
```

## Socket.IO events

| Event | Direction | Payload | Purpose |
|---|---|---|---|
| `chat:history` | server → client | `Message[]` | Past messages, sent on connect |
| `chat:send` | client → server | `{ text }` (ack `{ ok, error? }`) | Publish a new message |
| `chat:message` | server → all | `Message` | A new message for everyone |
| `chat:like` | client → server | `{ id }` | Like a message |
| `chat:like` | server → all | `{ id, likes }` | Updated like count |
| `chat:online` | server → all | `number` | Connected clients |

`Message` = `{ id, text, user, likes, createdAt }`

## Design notes
- The server is the source of truth: it assigns the random username, stores the history and counts likes, so every client sees the same data.
- Mention detection is a pure function (`getMentionQuery`) that looks at the text before the cursor.
- The emoji and mention popups are built without extra libraries to keep the bundle small.
- Message history is stored in memory (last 200 messages) and resets when the server restarts; a database would be the next step.

## Possible improvements
- Persist messages in a database
- Real user accounts instead of random usernames
- Typing indicators and message editing
- Automated tests (React Testing Library for the client, Socket.IO client tests for the server)