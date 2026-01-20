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

    socket.on("join_user_room", (userId) => {
        socket.join(`user:${userId}`);
        console.log(`User ${socket.id} joined user room: user:${userId}`);
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

export const notifyUser = (userId, data) => {
    if (io) {
        io.to(`user:${userId}`).emit("notification", data);
        console.log(`Notification sent to user room: user:${userId}`);
    }
};
