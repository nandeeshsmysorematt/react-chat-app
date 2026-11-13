import { io } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:4000";

// autoConnect is off: App connects when it mounts and disconnects on unmount.
export const socket = io(SERVER_URL, { autoConnect: false });