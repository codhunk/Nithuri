const Inquiry = require("./inquiry.model");

// @route   POST /api/v1/inquiries
exports.createInquiry = async (req, res, next) => {
  try {
    const { propertyId, ownerId, name, email, phone, message } = req.body;
    const inquiry = await Inquiry.create({
      property: propertyId,
      owner: ownerId,
      sender: req.user?._id,
      name, email, phone, message,
    });
    res.status(201).json({ success: true, message: "Inquiry sent successfully", data: inquiry });
  } catch (err) { next(err); }
};

// @route   GET /api/v1/inquiries/my - for owners to see their inquiries
exports.getMyInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find({ owner: req.user._id })
      .populate("property", "title address images")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (err) { next(err); }
};

// @route   PUT /api/v1/inquiries/:id/status
exports.updateInquiryStatus = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { status: req.body.status },
      { new: true }
    );
    if (!inquiry) return res.status(404).json({ success: false, message: "Inquiry not found" });
    res.json({ success: true, data: inquiry });
  } catch (err) { next(err); }
};
