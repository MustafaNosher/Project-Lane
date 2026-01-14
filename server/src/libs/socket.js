import { Server } from "socket.io";

let io; // single socket.io instance initialization

export const initSocket = (server) => {
  
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_task", (taskId) => {
      socket.join(`task:${taskId}`);
      console.log(`User ${socket.id} joined task room: task:${taskId}`);
    });

    socket.on("leave_task", (taskId) => {
      socket.leave(`task:${taskId}`);
      console.log(`User ${socket.id} left task room: task:${taskId}`);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

export const notifyTaskUpdate = (taskId, data) => {
  if (io) {
    io.to(`task:${taskId}`).emit("task_updated", data);
    console.log(`Notification sent to room: task:${taskId}`);
  }
};
