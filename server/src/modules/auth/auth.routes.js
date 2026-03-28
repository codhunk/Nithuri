const express = require("express");
const router = express.Router();
const {
  register,
  verifyOtp,
  resendOtp,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
} = require("./auth.controller");
const { protect } = require("../../middlewares/auth.middleware");

router.post("/register", register);         // Step 1: Register → sends OTP
router.post("/verify-otp", verifyOtp);      // Step 2: Submit OTP → issues tokens
router.post("/resend-otp", resendOtp);      // Resend OTP if expired
router.post("/login", login);               // Login (redirects to verify if unverified)
router.post("/refresh", refreshToken);      // Refresh access token
router.post("/logout", protect, logout);    // Logout
router.post("/forgot-password", forgotPassword); // Send reset link
router.put("/reset-password/:token", resetPassword); // Reset password

module.exports = router;
