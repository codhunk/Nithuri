const express = require("express");
const router = express.Router();
const { getOrCreateConversation, getMyConversations, getMessages, deleteMessage } = require("./chat.controller");
const { protect } = require("../../middlewares/auth.middleware");

router.use(protect); // all chat routes require auth

router.post("/conversations", getOrCreateConversation);
router.get("/conversations", getMyConversations);
router.get("/conversations/:id/messages", getMessages);
router.delete("/messages/:id", deleteMessage);

module.exports = router;
