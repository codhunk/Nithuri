const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const labourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  skill_type: { 
    type: String, 
    required: true, 
    enum: ["POP Worker", "Painter", "Electrician", "Plumber", "Carpenter", "General Labour"] 
  },
  experience: { type: Number, required: true },
  wage: { type: Number, required: true },
  availability: { type: String, enum: ["Available", "Not Available"], default: "Available" },
  location: { type: String, required: true },
  documents: { type: String }, // Path/URL to Aadhar/PAN
  profile_image: { type: String }, // Path/URL to photo
  refreshToken: { type: String, select: false },
}, { timestamps: true });

// Hash password before save
labourSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
labourSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Labour", labourSchema);
