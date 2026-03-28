const User = require("../user/user.model");
const Property = require("../property/property.model");
const Inquiry = require("../inquiry/inquiry.model");
const Conversation = require("../chat/conversation.model");
const Message = require("../chat/message.model");

// @route   GET /api/v1/admin/stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalOwners, totalProperties, pendingProperties, totalInquiries, totalMessages] =
      await Promise.all([
        User.countDocuments({ role: "user" }),
        User.countDocuments({ role: "owner" }),
        Property.countDocuments({ isDeleted: false }),
        Property.countDocuments({ status: "pending", isDeleted: false }),
        Inquiry.countDocuments(),
        Message.countDocuments(),
      ]);

    res.json({
      success: true,
      data: { totalUsers, totalOwners, totalProperties, pendingProperties, totalInquiries, totalMessages },
    });
  } catch (err) { next(err); }
};

// @route   GET /api/v1/admin/users
exports.getAllUsers = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.search) filter.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } },
    ];

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    res.json({ success: true, data: users, pagination: { total, page, limit, pages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
};

// @route   PUT /api/v1/admin/users/:id/block
exports.blockUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: req.body.isBlocked },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: `User ${user.isBlocked ? "blocked" : "unblocked"}`, data: user });
  } catch (err) { next(err); }
};

// @route   GET /api/v1/admin/properties
exports.getAllPropertiesAdmin = async (req, res, next) => {
  try {
    const filter = { isDeleted: false };
    if (req.query.status) filter.status = req.query.status;

    const properties = await Property.find(filter)
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: properties.length, data: properties });
  } catch (err) { next(err); }
};

// @route   PUT /api/v1/admin/properties/:id/approve
exports.approveProperty = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body; // status: approved | rejected
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status, ...(rejectionReason && { rejectionReason }) },
      { new: true }
    ).populate("owner", "name email");

    if (!property) return res.status(404).json({ success: false, message: "Property not found" });
    res.json({ success: true, message: `Property ${status}`, data: property });
  } catch (err) { next(err); }
};

// @route   DELETE /api/v1/admin/properties/:id
exports.forceDeleteProperty = async (req, res, next) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Property permanently deleted" });
  } catch (err) { next(err); }
};
