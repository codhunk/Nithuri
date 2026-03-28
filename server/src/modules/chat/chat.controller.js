const Conversation = require("./conversation.model");
const Message = require("./message.model");

// @route   POST /api/v1/chat/conversations
// Start or get existing conversation between two users about a property
exports.getOrCreateConversation = async (req, res, next) => {
  try {
    const { receiverId, propertyId } = req.body;
    const senderId = req.user._id;

    if (senderId.toString() === receiverId) {
      return res.status(400).json({ success: false, message: "Cannot chat with yourself" });
    }

    // Find existing conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
      ...(propertyId && { property: propertyId }),
    }).populate("participants", "name avatar isOnline lastSeen")
      .populate("property", "title images address");

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        property: propertyId || null,
      });
      conversation = await conversation.populate([
        { path: "participants", select: "name avatar isOnline lastSeen" },
        { path: "property", select: "title images address" },
      ]);
    }

    res.json({ success: true, data: conversation });
  } catch (err) { next(err); }
};

// @route   GET /api/v1/chat/conversations
// Get all conversations for the logged-in user
exports.getMyConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
      isDeleted: false,
    })
      .populate("participants", "name avatar isOnline lastSeen")
      .populate("property", "title images")
      .sort({ lastMessageTime: -1 });

    res.json({ success: true, data: conversations });
  } catch (err) { next(err); }
};

// @route   GET /api/v1/chat/conversations/:id/messages
// Get paginated message history for a conversation
exports.getMessages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 50);
    const skip = (page - 1) * limit;

    // Verify user is a participant
    const conversation = await Conversation.findOne({
      _id: id,
      participants: req.user._id,
    });
    if (!conversation) return res.status(404).json({ success: false, message: "Conversation not found" });

    const [messages, total] = await Promise.all([
      Message.find({ conversation: id, isDeleted: false })
        .populate("sender", "name avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Message.countDocuments({ conversation: id, isDeleted: false }),
    ]);

    // Mark messages as seen where receiver = current user
    await Message.updateMany(
      { conversation: id, receiver: req.user._id, status: { $ne: "seen" } },
      { status: "seen" }
    );

    res.json({
      success: true,
      data: messages.reverse(), // oldest first
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (err) { next(err); }
};

// @route   DELETE /api/v1/chat/messages/:id
exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findOne({ _id: req.params.id, sender: req.user._id });
    if (!message) return res.status(404).json({ success: false, message: "Message not found" });
    await Message.findByIdAndUpdate(req.params.id, { isDeleted: true, message: "This message was deleted" });
    res.json({ success: true, message: "Message deleted" });
  } catch (err) { next(err); }
};
