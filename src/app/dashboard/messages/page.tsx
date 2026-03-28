"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import { chatApi, ApiError } from "@/lib/api";

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

export default function MessagesPage() {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchConvs = async () => {
      try {
        const res = await chatApi.getConversations();
        setConversations(res.data);
        if (res.data.length > 0) {
          // Default selection could be first one, but maybe better to leave empty
        }
      } catch (err) {
        console.error("Failed to fetch conversations", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConvs();
  }, []);

  useEffect(() => {
    if (selectedConv) {
      const fetchMessages = async () => {
        try {
          const res = await chatApi.getMessages(selectedConv._id);
          setMessages(res.data.reverse());
          if (socket) {
            socket.emit("join_conversation", selectedConv._id);
            socket.emit("message_seen", { conversationId: selectedConv._id, senderId: getOtherParticipant(selectedConv)?._id });
          }
        } catch (err) {
          console.error("Failed to fetch messages", err);
        }
      };
      fetchMessages();
    }
  }, [selectedConv, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msg: Message) => {
      if (selectedConv && msg.sender._id !== user?._id) {
         setMessages(prev => [...prev, msg]);
         socket.emit("message_seen", { conversationId: selectedConv._id, senderId: msg.sender._id });
      }
      
      // Update sidebar conversation list
      setConversations(prev => {
        const index = prev.findIndex(c => c._id === (msg as any).conversation || c._id === selectedConv?._id);
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            lastMessage: msg.message,
            lastMessageTime: msg.createdAt,
          };
          // Move to top
          const [moved] = updated.splice(index, 1);
          return [moved, ...updated];
        }
        return prev;
      });
    };

    socket.on("receive_message", handleReceiveMessage);
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, selectedConv, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConv || !socket) return;

    const other = getOtherParticipant(selectedConv);
    const data = {
      conversationId: selectedConv._id,
      receiverId: other?._id,
      message: newMessage,
    };

    socket.emit("send_message", data);
    
    // Optimistic update (or wait for receive_message if backend emits to sender too)
    // The backend emits to conversation room which includes sender, so we'll get it in receive_message
    setNewMessage("");
  };

  const getOtherParticipant = (conv: Conversation) => {
    return conv.participants.find(p => p._id !== user?._id);
  };

  if (!user) return null;

  return (
    <div className="flex-1 flex h-[calc(100vh-80px)] overflow-hidden transition-all duration-300">
      {/* List Section */}
      <div className="w-full md:w-80 lg:w-[400px] flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-primary/10 flex flex-col overflow-hidden">
         <div className="p-4 border-b border-slate-50 dark:border-primary/5">
           <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all dark:text-white"
              />
           </div>
         </div>
         <div className="flex-1 overflow-y-auto divide-y divide-slate-50 dark:divide-primary/5 scrollbar-hide">
           {isLoading ? (
             [1, 2, 3].map(i => <div key={i} className="p-6 animate-pulse bg-slate-50 dark:bg-primary/5 h-24 mb-1" />)
           ) : conversations.length === 0 ? (
             <div className="p-8 text-center text-slate-400">
                <p>No conversations found.</p>
             </div>
           ) : (
             conversations.map((conv) => {
               const other = getOtherParticipant(conv);
               const isActive = selectedConv?._id === conv._id;
               return (
                 <div 
                   key={conv._id}
                   onClick={() => setSelectedConv(conv)}
                   className={`p-5 cursor-pointer transition-all hover:bg-primary/5 relative group ${
                     isActive ? "bg-primary/5 border-l-4 border-primary" : ""
                   }`}
                 >
                   <div className="flex gap-4">
                     <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform flex-shrink-0 overflow-hidden">
                       {other?.avatar ? <img src={other.avatar} className="w-full h-full object-cover" /> : other?.name.charAt(0)}
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-center mb-1">
                         <p className="font-bold text-sm dark:text-white truncate">{other?.name}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase whitespace-nowrap">
                            {conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                         </p>
                       </div>
                       {conv.property && (
                         <p className="text-primary text-[10px] font-bold uppercase tracking-tight mb-2 flex items-center gap-1">
                           <span className="material-symbols-outlined text-[10px]">location_on</span>
                           {conv.property.title}
                         </p>
                       )}
                       <p className={`text-xs truncate ${conv.unreadCount > 0 ? "font-black text-slate-900 dark:text-white" : "text-slate-500"}`}>
                         {conv.lastMessage || "Start a conversation..."}
                       </p>
                     </div>
                   </div>
                 </div>
               );
             })
           )}
         </div>
      </div>

      {/* Conversation Section */}
      <div className="hidden md:flex flex-1 flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
        {selectedConv ? (
          <>
            <div className="bg-white dark:bg-slate-900 p-6 flex items-center justify-between border-b border-slate-100 dark:border-primary/10 shadow-sm z-10">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xl overflow-hidden">
                    {getOtherParticipant(selectedConv)?.avatar ? <img src={getOtherParticipant(selectedConv)?.avatar} className="w-full h-full object-cover" /> : getOtherParticipant(selectedConv)?.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-black text-lg dark:text-white leading-tight">{getOtherParticipant(selectedConv)?.name}</h2>
                    <div className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-slate-300"}`} />
                       <p className="text-slate-500 text-xs">{isConnected ? "Online" : "Connecting..."}</p>
                    </div>
                  </div>
               </div>
               <div className="flex gap-2">
                 <button className="w-10 h-10 rounded-xl border border-slate-100 dark:border-primary/10 flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
                   <span className="material-symbols-outlined">call</span>
                 </button>
                 <button className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                   <span className="material-symbols-outlined">block</span>
                 </button>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-4 scrollbar-hide bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-90">
               {messages.map((msg, i) => {
                 const isMe = msg.sender._id === user._id;
                 return (
                   <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm border ${
                        isMe 
                        ? "bg-primary text-white border-transparent rounded-br-none" 
                        : "bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-100 dark:border-primary/5 rounded-bl-none"
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                        <div className={`flex items-center gap-1 mt-2 ${isMe ? "justify-end opacity-70" : "justify-start opacity-50"}`}>
                           <p className="text-[10px] font-bold uppercase">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                           {isMe && <span className="material-symbols-outlined text-[12px]">{msg.status === "seen" ? "done_all" : "done"}</span>}
                        </div>
                      </div>
                   </div>
                 );
               })}
               <div ref={messagesEndRef} />
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-primary/10">
               <div className="flex gap-4 p-2 bg-slate-50 dark:bg-primary/5 rounded-2xl border border-slate-100 dark:border-primary/20 items-end">
                  <textarea
                    rows={1}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                    placeholder="Type your reply..."
                    className="flex-1 bg-transparent border-none outline-none focus:ring-0 py-2.5 text-sm dark:text-white resize-none px-4"
                  />
                  <button 
                    onClick={sendMessage}
                    className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 mb-0.5 flex-shrink-0"
                  >
                     <span className="material-symbols-outlined">send</span>
                  </button>
               </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
             <span className="material-symbols-outlined text-6xl mb-4 bg-primary/10 p-8 rounded-full text-primary">forum</span>
             <p className="font-bold">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
