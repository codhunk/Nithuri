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

  const fetchConvs = async () => {
    try {
      const res = await chatApi.getConversations();
      setConversations(res.data);
    } catch (err) {
      console.error("Failed to fetch conversations", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConvs();
  }, []);

  useEffect(() => {
    if (selectedConv) {
      const fetchMessages = async () => {
        try {
          const res = await chatApi.getMessages(selectedConv._id);
          // Standard: newer messages at bottom
          // Backend already reverses messages to be [oldest, ..., newest]
          setMessages(res.data);
          if (socket) {
            socket.emit("join_conversation", selectedConv._id);
            const other = getOtherParticipant(selectedConv);
            socket.emit("message_seen", { conversationId: selectedConv._id, senderId: other?._id });
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
      // 1. Update Messages list if exactly this chat is open
      if (selectedConv && (msg as any).conversation === selectedConv._id) {
         setMessages(prev => {
           // Prevent duplicates (fixed key error)
           if (prev.find(m => m._id === msg._id)) return prev;
           return [...prev, msg];
         });
         
         if (msg.sender._id !== user?._id) {
           socket.emit("message_seen", { conversationId: selectedConv._id, senderId: msg.sender._id });
         }
      }
      
      // 2. Update Sidebar position and last message
      updateSidebar(msg);
    };

    const handleNewNotification = (data: { conversationId: string, message: Message }) => {
       updateSidebar(data.message);
    };

    const updateSidebar = (msg: Message) => {
      setConversations(prev => {
        const index = prev.findIndex(c => c._id === (msg as any).conversation);
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
        } else {
          // If conversation isn't in list yet, refetch all
          fetchConvs();
          return prev;
        }
      });
    };

    const handleMessagesSeen = (data: { conversationId: string, seenBy: string }) => {
      if (selectedConv && data.conversationId === selectedConv._id) {
         setMessages(prev => prev.map(m => 
            m.receiver === data.seenBy ? { ...m, status: "seen" } : m
         ));
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("new_message_notification", handleNewNotification);
    socket.on("messages_seen", handleMessagesSeen);
    
    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("new_message_notification", handleNewNotification);
      socket.off("messages_seen", handleMessagesSeen);
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
    setNewMessage("");
  };

  const getOtherParticipant = (conv: Conversation) => {
    return conv.participants.find(p => p._id !== user?._id);
  };

  if (!user) return null;

  return (
    <div className="flex-1 flex h-[calc(100vh-80px)] overflow-hidden transition-all duration-300 relative">
      {/* Sidebar - Hidden on mobile if a chat is selected */}
      <div className={`w-full md:w-80 lg:w-[400px] flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-primary/10 flex flex-col overflow-hidden transition-all ${
        selectedConv ? "hidden md:flex" : "flex"
      }`}>
         <div className="p-4 border-b border-slate-50 dark:border-primary/5">
            <h1 className="text-xl font-black mb-4 dark:text-white px-2">Messages</h1>
            <div className="relative">
               <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
               <input
                 type="text"
                 placeholder="Search chats..."
                 className="w-full bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-2xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all dark:text-white"
               />
            </div>
         </div>
         <div className="flex-1 overflow-y-auto divide-y divide-slate-50 dark:divide-primary/5 scrollbar-hide">
           {isLoading ? (
             [1, 2, 3, 4, 5].map(i => <div key={i} className="p-6 animate-pulse border-b border-slate-50 h-24" />)
           ) : conversations.length === 0 ? (
             <div className="p-12 text-center text-slate-400">
                <span className="material-symbols-outlined text-5xl opacity-20 mb-2">chat_bubble</span>
                <p className="text-xs font-bold uppercase tracking-widest">No Active Chats</p>
             </div>
           ) : (
             conversations.map((conv) => {
               const other = getOtherParticipant(conv);
               const isActive = selectedConv?._id === conv._id;
               return (
                 <div 
                   key={conv._id}
                   onClick={() => setSelectedConv(conv)}
                   className={`p-5 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-primary/5 relative group ${
                     isActive ? "bg-primary/5 border-l-4 border-primary" : ""
                   }`}
                 >
                   <div className="flex gap-4">
                     <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex flex-shrink-0 items-center justify-center font-bold text-xl overflow-hidden shadow-inner">
                       {other?.avatar ? <img src={other.avatar} className="w-full h-full object-cover" /> : other?.name.charAt(0)}
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-center mb-1">
                         <p className="font-black text-sm dark:text-white truncate">{other?.name}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase whitespace-nowrap">
                            {conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ""}
                         </p>
                       </div>
                       {conv.property && (
                         <p className="text-primary text-[10px] font-black uppercase tracking-tight mb-2 truncate max-w-[150px]">
                           {conv.property.title}
                         </p>
                       )}
                       <p className={`text-xs truncate ${conv.unreadCount > 0 ? "font-black text-slate-900 dark:text-white" : "text-slate-500"}`}>
                         {conv.lastMessage || "Start chatting..."}
                       </p>
                     </div>
                   </div>
                 </div>
               );
             })
           )}
         </div>
      </div>

      {/* Main Chat Area - Full screen on mobile if selected */}
      <div className={`flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden ${
        selectedConv ? "flex" : "hidden md:flex"
      }`}>
        {selectedConv ? (
          <>
            <div className="bg-white dark:bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-primary/10 shadow-sm z-10 sticky top-0">
               <div className="flex items-center gap-4">
                  {/* Mobile Back Button */}
                  <button 
                    onClick={() => setSelectedConv(null)}
                    className="md:hidden w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-600 transition-colors"
                  >
                    <span className="material-symbols-outlined">arrow_back</span>
                  </button>
                  
                  <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-lg overflow-hidden shadow-lg shadow-primary/20">
                    {getOtherParticipant(selectedConv)?.avatar ? <img src={getOtherParticipant(selectedConv)?.avatar} className="w-full h-full object-cover" /> : getOtherParticipant(selectedConv)?.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-black text-base dark:text-white leading-tight">{getOtherParticipant(selectedConv)?.name}</h2>
                    <div className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-slate-300"}`} />
                       <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{isConnected ? "Online" : "Away"}</p>
                    </div>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                 <button className="w-10 h-10 rounded-xl border border-slate-100 dark:border-primary/10 flex items-center justify-center text-slate-400 hover:text-primary transition-all">
                   <span className="material-symbols-outlined text-xl">call</span>
                 </button>
                 <button className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all">
                   <span className="material-symbols-outlined text-xl">more_vert</span>
                 </button>
               </div>
            </div>

            {/* Chat Messages */}
            <div 
               className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scrollbar-hide relative bg-[#e5ddd5] dark:bg-slate-950"
               style={{
                  backgroundImage: "url('https://i.pinimg.com/originals/ab/ab/60/abab60f06ab52fa784665855c3ab27f4.png')",
                  backgroundSize: "400px",
                  backgroundRepeat: "repeat",
               }}
            >
               {messages.map((msg) => {
                 const isMe = msg.sender._id === user._id;
                 return (
                   <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl shadow-sm relative ${
                        isMe 
                        ? "bg-[#dcf8c6] dark:bg-primary text-slate-900 dark:text-white rounded-tr-none" 
                        : "bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-tl-none border border-black/5"
                      }`}>
                        <p className="text-sm leading-relaxed pr-2">{msg.message}</p>
                        <div className={`flex items-center justify-end gap-1 mt-1 opacity-60`}>
                           <p className="text-[10px] font-bold whitespace-nowrap">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </p>
                           {isMe && (
                              <span className={`material-symbols-outlined text-[14px] ${msg.status === "seen" ? "text-blue-500 font-black" : ""}`}>
                                {msg.status === "seen" ? "done_all" : "done"}
                              </span>
                           )}
                        </div>
                      </div>
                   </div>
                 );
               })}
               <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 md:p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-primary/10">
               <div className="flex gap-3 items-end max-w-5xl mx-auto">
                  <div className="flex-1 flex gap-2 p-2 bg-slate-50 dark:bg-primary/5 rounded-[1.5rem] border border-slate-100 dark:border-primary/10 items-center">
                     <textarea
                       rows={1}
                       value={newMessage}
                       onChange={(e) => setNewMessage(e.target.value)}
                       onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                       placeholder="Type your message..."
                       className="flex-1 bg-transparent border-none outline-none focus:ring-0 py-2 text-sm dark:text-white resize-none px-4"
                     />
                  </div>
                  <button 
                    onClick={sendMessage}
                    className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 transition-all flex-shrink-0"
                  >
                     <span className="material-symbols-outlined">send</span>
                  </button>
               </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 relative">
             <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "url('https://i.pinimg.com/originals/ab/ab/60/abab60f06ab52fa784665855c3ab27f4.png')" }} />
             <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-primary/5 flex flex-col items-center text-center max-w-md mx-6">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 animate-bounce">
                  <span className="material-symbols-outlined text-4xl">forum</span>
                </div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 uppercase tracking-tighter">Nithuri Messenger</h3>
                <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8">Send and receive messages about properties securely. Click on a conversation to start chatting.</p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                   <span className="material-symbols-outlined text-xs">encrypted</span>
                   End-to-end encrypted
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
