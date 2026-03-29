const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: [true, "Title is required"], trim: true, maxlength: 200 },
    description: { type: String, required: [true, "Description is required"] },
    price: { type: Number, required: [true, "Price is required"], min: 0 },
    priceType: { type: String, enum: ["fixed", "negotiable", "monthly"], default: "fixed" },
    propertyType: {
      type: String,
      enum: ["apartment", "house", "villa", "plot", "commercial", "farmhouse", "other"],
      required: true,
    },
    listingType: { type: String, enum: ["sell", "rent", "lease"], required: true },
    area: {
      size: { type: Number, required: true },
      unit: { type: String, enum: ["sqft", "sqm", "bigha", "acre", "marla"], default: "sqft" },
    },
    address: {
      street: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: String,
      country: { type: String, default: "India" },
    },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }, // [longitude, latitude]
    },
    amenities: [{ type: String }],
    images: [
      {
        url: String,
        public_id: String,
        isCover: { type: Boolean, default: false },
      },
    ],
    status: { type: String, enum: ["pending", "approved", "rejected", "sold", "rented"], default: "pending" },
    isDeleted: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    parking: { type: Boolean, default: false },
    furnished: { type: String, enum: ["unfurnished", "semi-furnished", "fully-furnished"], default: "unfurnished" },
    availableFrom: { type: Date },
    rejectionReason: { type: String },
  },
  { timestamps: true }
);

// Geo index for location-based search
propertySchema.index({ location: "2dsphere" });
propertySchema.index({ status: 1, isDeleted: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ "address.city": 1 });
propertySchema.index({ propertyType: 1, listingType: 1 });
propertySchema.index({ title: "text", description: "text", "address.city": "text", "address.state": "text" });

module.exports = mongoose.model("Property", propertySchema);
