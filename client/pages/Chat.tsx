import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { userAPI, messageAPI } from "@/services/api";
import {
  initializeSocket,
  emitUserOnline,
  onOnlineUsers,
  sendMessage as socketSendMessage,
  onReceiveMessage,
} from "@/services/socket";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Search, Circle } from "lucide-react";

interface User {
  _id: string;
  username: string;
  name: string;
  profilePic: string;
}

interface MessageUser {
  _id: string;
  username: string;
  name: string;
  profilePic: string;
}

interface Message {
  _id: string;
  senderId: string | MessageUser;
  receiverId: string | MessageUser;
  message: string;
  image?: string;
  createdAt: string;
}

interface Conversation {
  _id: string;
  senderId: User;
  receiverId: User;
  message: string;
  createdAt: string;
}

export default function Chat() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<{ userId: string; socketId: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getMessageUserId = (messageUser: string | MessageUser) =>
    typeof messageUser === "string" ? messageUser : messageUser._id;

  useEffect(() => {
    loadUsers();
    loadConversations();
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    initializeSocket();
    emitUserOnline(user.id);

    const onlineCleanup = onOnlineUsers((users) => setOnlineUsers(users));
    const messageCleanup = onReceiveMessage((incomingMessage: Message) => {
      loadConversations();

      setMessages((prev) => {
        const senderId = getMessageUserId(incomingMessage.senderId);
        const receiverId = getMessageUserId(incomingMessage.receiverId);
        const isSelectedConversation =
          selectedUserId !== null &&
          ((senderId === user.id && receiverId === selectedUserId) ||
            (senderId === selectedUserId && receiverId === user.id));

        if (!isSelectedConversation) {
          return prev;
        }

        const exists = prev.some((msg) => msg._id === incomingMessage._id);
        return exists ? prev : [...prev, incomingMessage];
      });
    });

    return () => {
      onlineCleanup();
      messageCleanup();
    };
  }, [selectedUserId, user]);

  useEffect(() => {
    if (selectedUserId) {
      loadMessages(selectedUserId);
    } else {
      setMessages([]);
    }
  }, [selectedUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadUsers = async () => {
    try {
      const response = await userAPI.getAllUsers();
      setUsers(response.data.filter((u: User) => u._id !== user?.id));
    } catch (error) {
      console.error(error);
    }
  };

  const loadConversations = async () => {
    try {
      const response = await messageAPI.getConversations();
      setConversations(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadMessages = async (userId: string) => {
    try {
      const response = await messageAPI.getMessages(userId);
      setMessages(response.data);
    } catch {
      toast.error("Failed to load messages");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedUserId) return;

    try {
      const response = await messageAPI.sendMessage({
        receiverId: selectedUserId,
        message: messageText,
      });

      const savedMessage: Message = response.data;

      setMessages((prev) => [...prev, savedMessage]);
      socketSendMessage(savedMessage);
      setMessageText("");
      loadConversations();
    } catch {
      toast.error("Failed to send message");
    }
  };

  const isUserOnline = (userId: string) =>
    onlineUsers.some((onlineUser) => onlineUser.userId === userId);

  const getOtherUser = (conversation: Conversation) =>
    conversation.senderId._id === user?.id
      ? conversation.receiverId
      : conversation.senderId;

  const filteredConversations = conversations.filter((c) => {
    const other = getOtherUser(c);
    return (
      other.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      other.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const sidebarUsers =
    filteredConversations.length > 0
      ? filteredConversations.map((c) => ({
          ...getOtherUser(c),
          lastMessage: c.message,
        }))
      : users.map((u) => ({
          ...u,
          lastMessage: "Start a conversation",
        }));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="md:ml-64">
        <div className="max-w-6xl mx-auto p-4 md:p-6 h-screen flex gap-6">
          
          {/* Sidebar */}
          <div className="hidden md:flex md:w-80 bg-card border border-white/10 rounded-xl flex-col">
            <div className="p-4 border-b border-white/10">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {sidebarUsers.map((u) => (
                <button
                  key={u._id}
                  onClick={() => setSelectedUserId(u._id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left ${
                    selectedUserId === u._id
                      ? "bg-gradient-to-r from-purple-600 to-pink-600"
                      : "hover:bg-white/5"
                  }`}
                >
                  <div className="relative">
                    <img
                      src={u.profilePic}
                      className="w-10 h-10 rounded-full"
                    />
                    {isUserOnline(u._id) && (
                      <Circle className="w-3 h-3 absolute bottom-0 right-0 fill-green-500 text-green-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{u.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {u.lastMessage}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 bg-card border border-white/10 rounded-xl flex flex-col">
            {selectedUserId ? (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => {
                    const isOwn = getMessageUserId(msg.senderId) === user?.id;
                    return (
                      <div
                        key={msg._id}
                        className={`flex ${
                          isOwn ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`px-4 py-2 rounded-lg max-w-xs ${
                            isOwn
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                              : "bg-white/5 border border-white/10"
                          }`}
                        >
                          {msg.message}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t border-white/10 flex gap-2"
                >
                  <Input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                  />
                  <Button type="submit">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a user to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
