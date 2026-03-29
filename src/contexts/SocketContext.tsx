"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Derive socket URL from API URL if not explicitly provided (e.g. for Production)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const derivedUrl = apiUrl.replace("/api/v1", "");
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || derivedUrl;
      
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      
      const newSocket = io(socketUrl, {
        withCredentials: true,
        auth: { token },
      });

      newSocket.on("connect", () => {
        setIsConnected(true);
        console.log("✅ Socket connected");
      });

      newSocket.on("disconnect", () => {
        setIsConnected(false);
        console.log("❌ Socket disconnected");
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else {
       if (socket) {
          socket.disconnect();
          setSocket(null);
          setIsConnected(false);
       }
    }
  }, [isAuthenticated, user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used inside <SocketProvider>");
  return ctx;
};
