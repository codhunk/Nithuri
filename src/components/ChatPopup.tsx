"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import { chatApi } from "@/lib/api";

interface Message {
  _id: string;
  sender: { _id: string; name: string; avatar?: string };
  receiver: string;
  message: string;
  messageType: string;
  status: string;
  createdAt: string;
}

interface Conversation {
  _id: string;
  participants: { _id: string; name: string; avatar?: string }[];
  property?: { _id: string; title: string };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface ChatPopupProps {
  conversationId: string;
  onClose: () => void;
  receiver: { _id: string; name: string; avatar?: string };
}

export default function ChatPopup({ conversationId, onClose, receiver }: ChatPopupProps) {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (!conversationId) return;
    
    const fetchMessages = async () => {
      try {
        console.log("💬 Fetching messages for conversation:", conversationId);
        const res = await chatApi.getMessages(conversationId);
        setMessages(res.data);
        if (socket && isConnected) {
          console.log("🔌 Joining room:", conversationId);
          socket.emit("join_conversation", conversationId);
          socket.emit("message_seen", { conversationId, senderId: receiver._id });
        }
      } catch (err) {
        console.error("❌ Failed to fetch messages", err);
      }
    };
    fetchMessages();
  }, [conversationId, socket, isConnected, receiver._id]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msg: Message) => {
      console.log("📩 New message received:", msg);
      // Ensure conversation ID matches (handle string or object)
      const msgConvId = typeof (msg as any).conversation === 'string' 
        ? (msg as any).conversation 
        : (msg as any).conversation?._id || (msg as any).conversation;

      if (msgConvId === conversationId) {
        setMessages(prev => {
          if (prev.find(m => m._id === msg._id)) return prev;
          console.log("✅ Adding message to list");
          return [...prev, msg];
        });
        
        if (msg.sender._id !== user?._id) {
          socket.emit("message_seen", { conversationId, senderId: msg.sender._id });
        }
      }
    };

    const handleMessagesSeen = (data: { conversationId: string, seenBy: string }) => {
      if (data.conversationId === conversationId) {
        setMessages(prev => prev.map(m => 
          m.receiver === data.seenBy ? { ...m, status: "seen" } : m
        ));
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("messages_seen", handleMessagesSeen);
    
    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("messages_seen", handleMessagesSeen);
    };
  }, [socket, conversationId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !socket || !isConnected) {
      if (!isConnected) console.error("❌ Socket not connected");
      return;
    }

    const data = {
      conversationId,
      receiverId: receiver._id,
      message: newMessage,
    };

    console.log("📤 Sending message:", data);
    socket.emit("send_message", data);
    setNewMessage("");
  };

  if (!user) return null;

  return (
    <div className={`fixed bottom-6 right-6 w-[400px] max-w-[calc(100vw-48px)] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] rounded-3xl overflow-hidden border border-white/20 dark:border-primary/20 z-50 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform ${isMinimized ? "h-16 translate-y-0" : "h-[550px]"} flex flex-col`}>
      {/* Header */}
      <div 
        className="bg-primary p-4 flex items-center justify-between cursor-pointer group" 
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold overflow-hidden shadow-inner font-mono">
              {receiver.avatar ? <img src={receiver.avatar} className="w-full h-full object-cover" /> : receiver.name?.charAt(0)}
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-primary ${isConnected ? "bg-green-400" : "bg-red-400"} ring-2 ring-primary/20`} />
          </div>
          <div>
            <h3 className="text-white font-black text-xs leading-tight group-hover:underline underline-offset-2">{receiver.name}</h3>
            <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest">{isConnected ? "Online" : "Connecting..."}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white transition-all transform active:scale-90"
          >
            <span className="material-symbols-outlined text-lg transition-transform duration-300" style={{ transform: isMinimized ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              keyboard_arrow_down
            </span>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white transition-all transform hover:rotate-90 active:scale-90"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Area */}
          <div 
            className="flex-1 overflow-y-auto p-5 scrollbar-hide bg-[#f0f2f5] dark:bg-slate-950/20 relative"
            style={{
              backgroundImage: "url('https://i.pinimg.com/originals/ab/ab/60/abab60f06ab52fa784665855c3ab27f4.png')",
              backgroundSize: "280px",
              backgroundRepeat: "repeat",
              backgroundBlendMode: "overlay"
            }}
          >
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-30">
                  <span className="material-symbols-outlined text-4xl mb-2 text-primary">chat_bubble</span>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Nithuri Secure Messaging</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender?._id === user._id;
                  return (
                    <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] p-3.5 rounded-2xl shadow-sm relative group/msg ${
                        isMe 
                        ? "bg-primary text-white rounded-tr-none shadow-primary/20" 
                        : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none border border-black/5"
                      }`}>
                        <p className="text-[13px] leading-relaxed font-medium">{msg.message}</p>
                        <div className={`flex items-center justify-end gap-1 mt-1 opacity-60 transition-opacity group-hover/msg:opacity-100`}>
                          <p className="text-[9px] font-bold whitespace-nowrap">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {isMe && (
                            <span className={`material-symbols-outlined text-[12px] ${msg.status === "seen" ? "text-blue-300 font-extrabold" : ""}`}>
                              {msg.status === "seen" ? "done_all" : "done"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-primary/10">
            <div className="flex gap-2 items-center bg-slate-50 dark:bg-primary/5 rounded-[1.5rem] border border-slate-200 dark:border-primary/10 p-1.5 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), sendMessage())}
                placeholder="Type a message..."
                className="flex-1 bg-transparent border-none outline-none py-2 text-sm dark:text-white px-3"
              />
              <button 
                onClick={sendMessage}
                disabled={!newMessage.trim() || !isConnected}
                className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 transition-all disabled:opacity-30 disabled:scale-100"
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
              </button>
            </div>
            {!isConnected && (
              <p className="text-[9px] text-red-500 font-bold uppercase tracking-wider text-center mt-2 animate-pulse">Disconnected from server</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
