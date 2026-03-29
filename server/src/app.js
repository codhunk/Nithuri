const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");
const { initSocket } = require("./config/socket");
const errorHandler = require("./middlewares/errorHandler");
const seedAdmin = require("./utils/seed");

// Route Imports
const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/user/user.routes");
const propertyRoutes = require("./modules/property/property.routes");
const inquiryRoutes = require("./modules/inquiry/inquiry.routes");
const chatRoutes = require("./modules/chat/chat.routes");
const adminRoutes = require("./modules/admin/admin.routes");

// Connect to DB and seed admin
connectDB().then(seedAdmin);

const app = express();
const server = http.createServer(app);

// Trust Render's reverse proxy for correct IP identification in rate limiting
app.set("trust proxy", 1);

// Initialize Socket.IO
initSocket(server);

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Global rate limiter
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use("/api/", limiter);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/properties", propertyRoutes);
app.use("/api/v1/inquiries", inquiryRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/admin", adminRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Nithuri Backend is running 🚀", timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} | Mode: ${process.env.NODE_ENV}`);
});

module.exports = { app, server };
