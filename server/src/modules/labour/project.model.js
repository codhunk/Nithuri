const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  project_name: { type: String, required: true, default: "Nithuri Project" },
  required_skills: [{ type: String }],
  number_of_labours_needed: { type: Number, required: true },
  budget: { type: Number },
  location: { type: String, required: true },
  start_date: { type: Date },
  end_date: { type: Date },
  posted_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
