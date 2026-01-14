import { io } from "socket.io-client";
import { API_BASE_URL } from "@/config/routes";

const SOCKET_URL = API_BASE_URL.replace("/api", "");

export const socket = io(SOCKET_URL, {
  autoConnect: false, // Don't connect until needed
});

export const joinTaskRoom = (taskId: string) => {
  if (socket.connected) {
    socket.emit("join_task", taskId);
  } else {
    socket.connect();
    socket.once("connect", () => {
      socket.emit("join_task", taskId);
    });
  }
};

export const leaveTaskRoom = (taskId: string) => {
  if (socket.connected) {
    socket.emit("leave_task", taskId);
  }
};
