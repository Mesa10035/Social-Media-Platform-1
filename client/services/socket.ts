import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

type OnlineUser = {
  userId: string;
  socketId: string;
};

type ChatUser = {
  _id: string;
  username: string;
  name: string;
  profilePic: string;
};

type MessageUser = string | ChatUser;

export type SocketMessage = {
  _id: string;
  senderId: MessageUser;
  receiverId: MessageUser;
  message: string;
  image?: string;
  createdAt: string;
};

export function initializeSocket() {
  if (socket) return socket;

  socket = io(window.location.origin, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket?.id);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function emitUserOnline(userId: string) {
  if (socket) {
    socket.emit("user-online", userId);
  }
}

export function onOnlineUsers(callback: (users: OnlineUser[]) => void) {
  if (socket) {
    socket.on("online-users", callback);
  }

  return () => {
    socket?.off("online-users", callback);
  };
}

export function sendMessage(data: SocketMessage) {
  if (socket) {
    socket.emit("send-message", data);
  }
}

export function onMessageSent(callback: (message: SocketMessage) => void) {
  if (socket) {
    socket.on("message-sent", callback);
  }

  return () => {
    socket?.off("message-sent", callback);
  };
}

export function onReceiveMessage(callback: (message: SocketMessage) => void) {
  if (socket) {
    socket.on("receive-message", callback);
  }

  return () => {
    socket?.off("receive-message", callback);
  };
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
