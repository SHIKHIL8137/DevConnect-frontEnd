// /config/socket.js or socket.ts
import { io } from "socket.io-client";

const url = import.meta.env.VITE_BACKEND_URL;

const socket = io(url, {
  path: "/socket.io/",
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;
