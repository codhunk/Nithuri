const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const User = require("../modules/user/user.model");
const Message = require("../modules/chat/message.model");
const Conversation = require("../modules/chat/conversation.model");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true,
    },
  });

  // ─── JWT Auth Middleware ──────────────────────────────────────────────────
  io.use(async (socket, next) => {
    try {
      let token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(" ")[1];
      
      // Try to get from cookies (for httpOnly support)
      if (!token && socket.handshake.headers.cookie) {
        const cookies = cookie.parse(socket.handshake.headers.cookie);
        token = cookies.accessToken;
      }

      if (!token) return next(new Error("Authentication error: No token"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return next(new Error("Authentication error: User not found"));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    const user = socket.user;
    console.log(`🔌 Socket connected: ${user.name} (${user._id})`);

    // Mark user online
    await User.findByIdAndUpdate(user._id, { isOnline: true, lastSeen: new Date() });
    io.emit("user_status", { userId: user._id, isOnline: true });

    // ─── Join personal room ──────────────────────────────────────────────
    socket.join(user._id.toString());

    // ─── Join Conversation ───────────────────────────────────────────────
    socket.on("join_conversation", (conversationId) => {
      socket.join(conversationId);
      console.log(`📥 ${user.name} joined conversation: ${conversationId}`);
    });

    // ─── Send Message ────────────────────────────────────────────────────
    socket.on("send_message", async (data) => {
      try {
        const { conversationId, receiverId, message, messageType = "text" } = data;

        const newMessage = await Message.create({
          conversation: conversationId,
          sender: user._id,
          receiver: receiverId,
          message,
          messageType,
          status: "sent",
        });

        // Update conversation last message
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: message,
          lastMessageTime: new Date(),
        });

        const populatedMessage = await newMessage.populate("sender", "name avatar");

        // 1. Emit to the specific conversation room (for anyone already inside looking)
        io.to(conversationId.toString()).emit("receive_message", populatedMessage);

        // 2. Emit to the receiver's personal room (important for sidebar updates if they aren't in conversation room)
        io.to(receiverId.toString()).emit("receive_message", populatedMessage);

        // Notify receiver's personal room for UI notifications/badge
        if (receiverId.toString() !== user._id.toString()) {
          socket.to(receiverId.toString()).emit("new_message_notification", {
            conversationId,
            message: populatedMessage,
          });
        }

        // Acknowledge delivery
        socket.emit("message_delivered", { messageId: newMessage._id });
        await Message.findByIdAndUpdate(newMessage._id, { status: "delivered" });
      } catch (err) {
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // ─── Typing Indicator ────────────────────────────────────────────────
    socket.on("typing", ({ conversationId, receiverId }) => {
      socket.to(conversationId).emit("typing", { userId: user._id, conversationId });
    });

    socket.on("stop_typing", ({ conversationId }) => {
      socket.to(conversationId).emit("stop_typing", { userId: user._id });
    });

    // ─── Mark Messages as Seen ───────────────────────────────────────────
    socket.on("message_seen", async ({ conversationId, senderId }) => {
      await Message.updateMany(
        { conversation: conversationId, receiver: user._id, status: { $ne: "seen" } },
        { status: "seen" }
      );
      // Notify everyone in the conversation that messages were seen
      io.to(conversationId.toString()).emit("messages_seen", { 
        conversationId, 
        seenBy: user._id.toString() 
      });
    });

    // ─── Disconnect ──────────────────────────────────────────────────────
    socket.on("disconnect", async () => {
      await User.findByIdAndUpdate(user._id, { isOnline: false, lastSeen: new Date() });
      io.emit("user_status", { userId: user._id, isOnline: false, lastSeen: new Date() });
      console.log(`🔌 Socket disconnected: ${user.name}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

module.exports = { initSocket, getIO };
