const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // null if unauthenticated
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    message: { type: String, required: true, maxlength: 1000 },
    status: { type: String, enum: ["new", "read", "replied", "closed"], default: "new" },
  },
  { timestamps: true }
);

inquirySchema.index({ owner: 1, status: 1 });
inquirySchema.index({ property: 1 });

module.exports = mongoose.model("Inquiry", inquirySchema);
