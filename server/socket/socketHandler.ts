import { Server, Socket } from "socket.io";

interface OnlineUser {
  userId: string;
  socketId: string;
}

interface SocketUser {
  _id: string;
}

interface SocketMessage {
  _id: string;
  senderId: string | SocketUser;
  receiverId: string | SocketUser;
  message: string;
  image?: string;
  createdAt: string;
}

const onlineUsers: OnlineUser[] = [];

function getUserId(user: string | SocketUser) {
  return typeof user === "string" ? user : user._id;
}

export function setupSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("New user connected:", socket.id);

    // User comes online
    socket.on("user-online", (userId: string) => {
      const existingUser = onlineUsers.find((u) => u.userId === userId);
      if (!existingUser) {
        onlineUsers.push({ userId, socketId: socket.id });
      }
      io.emit("online-users", onlineUsers);
    });

    // User goes offline
    socket.on("disconnect", () => {
      const index = onlineUsers.findIndex((u) => u.socketId === socket.id);
      if (index !== -1) {
        onlineUsers.splice(index, 1);
      }
      io.emit("online-users", onlineUsers);
    });

    // Send message
    socket.on("send-message", (data: SocketMessage) => {
      try {
        const receiverId = getUserId(data.receiverId);

        // Send to receiver if online
        const receiverSocket = onlineUsers.find((u) => u.userId === receiverId);
        if (receiverSocket) {
          io.to(receiverSocket.socketId).emit("receive-message", data);
        }

        // Confirm message sent to sender
        socket.emit("message-sent", data);
      } catch (error) {
        console.error("Failed to broadcast message:", error);
      }
    });

    // Get online status
    socket.on("get-online-users", () => {
      socket.emit("online-users", onlineUsers);
    });
  });
}
