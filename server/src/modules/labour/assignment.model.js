const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  labour_id: { type: mongoose.Schema.Types.ObjectId, ref: "Labour", required: true },
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  assigned_date: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "assigned", "in-progress", "completed", "rejected"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Assignment", assignmentSchema);
