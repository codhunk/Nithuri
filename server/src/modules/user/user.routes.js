const express = require("express");
const router = express.Router();
const { getMe, updateMe, changePassword, toggleFavorite, getFavorites } = require("./user.controller");
const { protect } = require("../../middlewares/auth.middleware");
const upload = require("../../middlewares/upload.middleware");

// Set upload folder for avatars
router.use((req, res, next) => { req.uploadFolder = "avatars"; next(); });

router.get("/me", protect, getMe);
router.put("/me", protect, upload.single("avatar"), updateMe);
router.put("/me/change-password", protect, changePassword);
router.post("/favorites/:propertyId", protect, toggleFavorite);
router.get("/favorites", protect, getFavorites);

module.exports = router;
