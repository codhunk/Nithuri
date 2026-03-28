const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../user/user.model");
const { sendOtpEmail, sendPasswordResetEmail } = require("../../config/email");

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Generate a 6-digit numeric OTP */
const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });
  return { accessToken, refreshToken };
};

const setCookies = (res, accessToken, refreshToken) => {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("accessToken", accessToken, {
    httpOnly: true, secure: isProd, sameSite: "strict", maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, secure: isProd, sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// ─── Register ─────────────────────────────────────────────────────────────────
// @route POST /api/v1/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "Email already registered" });

    const allowedRoles = ["user", "owner"];
    const otp = generateOtp();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    const user = await User.create({
      name, email, password, phone,
      role: allowedRoles.includes(role) ? role : "user",
      emailOtp: hashedOtp,
      emailOtpExpires: Date.now() + 10 * 60 * 1000, // 10 min
      emailOtpAttempts: 0,
    });

    // Send OTP via Resend
    await sendOtpEmail({ to: email, name, otp });

    res.status(201).json({
      success: true,
      message: "Registration successful. Check your email for the 6-digit verification code.",
      data: { email: user.email, isVerified: user.isVerified },
    });
  } catch (err) { next(err); }
};

// ─── Verify OTP ───────────────────────────────────────────────────────────────
// @route POST /api/v1/auth/verify-otp
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP are required" });

    const user = await User.findOne({ email })
      .select("+emailOtp +emailOtpExpires +emailOtpAttempts +refreshToken");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.isVerified) return res.status(400).json({ success: false, message: "Email already verified" });

    // Too many attempts
    if (user.emailOtpAttempts >= 5) {
      return res.status(429).json({ success: false, message: "Too many attempts. Request a new OTP." });
    }

    // Expired
    if (!user.emailOtpExpires || user.emailOtpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired. Please request a new one." });
    }

    // Compare
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    if (user.emailOtp !== hashedOtp) {
      await User.findByIdAndUpdate(user._id, { $inc: { emailOtpAttempts: 1 } });
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Mark verified & clear OTP fields
    await User.findByIdAndUpdate(user._id, {
      isVerified: true,
      emailOtp: null,
      emailOtpExpires: null,
      emailOtpAttempts: 0,
    });

    // Issue tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    await User.findByIdAndUpdate(user._id, { refreshToken });
    setCookies(res, accessToken, refreshToken);

    res.json({
      success: true,
      message: "Email verified successfully! Welcome aboard 🎉",
      data: { _id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken,
    });
  } catch (err) { next(err); }
};

// ─── Resend OTP ───────────────────────────────────────────────────────────────
// @route POST /api/v1/auth/resend-otp
exports.resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.isVerified) return res.status(400).json({ success: false, message: "Email already verified" });

    const otp = generateOtp();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    await User.findByIdAndUpdate(user._id, {
      emailOtp: hashedOtp,
      emailOtpExpires: Date.now() + 10 * 60 * 1000,
      emailOtpAttempts: 0,
    });

    await sendOtpEmail({ to: email, name: user.name, otp });

    res.json({ success: true, message: "New OTP sent to your email" });
  } catch (err) { next(err); }
};

// ─── Login ────────────────────────────────────────────────────────────────────
// @route POST /api/v1/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required" });

    const user = await User.findOne({ email }).select("+password +refreshToken");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    if (user.isBlocked) return res.status(403).json({ success: false, message: "Account suspended. Contact support." });
    if (!user.isVerified) {
      // Auto-send a new OTP
      const otp = generateOtp();
      const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
      await User.findByIdAndUpdate(user._id, {
        emailOtp: hashedOtp,
        emailOtpExpires: Date.now() + 10 * 60 * 1000,
        emailOtpAttempts: 0,
      });
      await sendOtpEmail({ to: email, name: user.name, otp });

      return res.status(403).json({
        success: false,
        message: "Email not verified. A new OTP has been sent to your email.",
        requiresVerification: true,
        email,
      });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);
    await User.findByIdAndUpdate(user._id, { refreshToken });
    setCookies(res, accessToken, refreshToken);

    res.json({
      success: true,
      message: "Login successful",
      data: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
      accessToken,
    });
  } catch (err) { next(err); }
};

// ─── Refresh Token ────────────────────────────────────────────────────────────
// @route POST /api/v1/auth/refresh
exports.refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (!token) return res.status(401).json({ success: false, message: "No refresh token" });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ success: false, message: "Invalid refresh token" });
    }

    const { accessToken, refreshToken: newRefresh } = generateTokens(user._id);
    await User.findByIdAndUpdate(user._id, { refreshToken: newRefresh });
    setCookies(res, accessToken, newRefresh);

    res.json({ success: true, accessToken });
  } catch (err) { next(err); }
};

// ─── Logout ───────────────────────────────────────────────────────────────────
// @route POST /api/v1/auth/logout
exports.logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: "" });
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ success: true, message: "Logged out successfully" });
  } catch (err) { next(err); }
};

// ─── Forgot Password ──────────────────────────────────────────────────────────
// @route POST /api/v1/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "No account with this email" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    await User.findByIdAndUpdate(user._id, {
      passwordResetToken: hashedToken,
      passwordResetExpires: Date.now() + 10 * 60 * 1000,
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendPasswordResetEmail({ to: email, name: user.name, resetUrl });

    res.json({ success: true, message: "Password reset link sent to your email" });
  } catch (err) { next(err); }
};

// ─── Reset Password ───────────────────────────────────────────────────────────
// @route PUT /api/v1/auth/reset-password/:token
exports.resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ success: false, message: "Reset link is invalid or has expired" });

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successful. You can now log in." });
  } catch (err) { next(err); }
};
