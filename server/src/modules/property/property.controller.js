const Property = require("./property.model");
const User = require("../user/user.model");

// Build query helper for filters
const buildFilter = (query) => {
  const filter = { isDeleted: false, status: "approved" };

  if (query.type) filter.propertyType = query.type;
  if (query.listingType) filter.listingType = query.listingType;
  if (query.city) filter["address.city"] = { $regex: query.city, $options: "i" };
  if (query.state) filter["address.state"] = { $regex: query.state, $options: "i" };
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }
  if (query.minArea || query.maxArea) {
    filter["area.size"] = {};
    if (query.minArea) filter["area.size"].$gte = Number(query.minArea);
    if (query.maxArea) filter["area.size"].$lte = Number(query.maxArea);
  }
  if (query.bedrooms) filter.bedrooms = Number(query.bedrooms);
  if (query.furnished) filter.furnished = query.furnished;

  return filter;
};

// @route   GET /api/v1/properties
exports.getAllProperties = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 12);
    const skip = (page - 1) * limit;

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
    };
    const sort = sortMap[req.query.sort] || { createdAt: -1 };

    const filter = buildFilter(req.query);
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    const [properties, total] = await Promise.all([
      Property.find(filter)
        .populate("owner", "name avatar phone email isOnline")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Property.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: properties,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (err) { next(err); }
};

// @route   GET /api/v1/properties/:id
exports.getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, isDeleted: false })
      .populate("owner", "name avatar phone email isOnline lastSeen");

    if (!property) return res.status(404).json({ success: false, message: "Property not found" });

    // Increment views
    await Property.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json({ success: true, data: property });
  } catch (err) { next(err); }
};

// @route   POST /api/v1/properties
exports.createProperty = async (req, res, next) => {
  try {
    const body = req.body;

    // Helper to get nested values or bracketed values
    const getVal = (obj, key, nestedKey) => {
      // If nested object exists (e.g. req.body.address.city)
      if (obj[key] && typeof obj[key] === "object" && obj[key][nestedKey]) {
        return obj[key][nestedKey];
      }
      // If flat bracket key exists (e.g. req.body["address[city]"])
      return obj[`${key}[${nestedKey}]`];
    };

    const data = {
      owner: req.user._id,
      title: body.title,
      description: body.description,
      price: Number(body.price || 0),
      propertyType: body.propertyType,
      listingType: body.listingType,
      bedrooms: Number(body.bedrooms || 0),
      bathrooms: Number(body.bathrooms || 0),
      address: {
        street: getVal(body, "address", "street") || body.address || "",
        city: getVal(body, "address", "city") || body.city || "",
        state: getVal(body, "address", "state") || body.state || "",
        pincode: getVal(body, "address", "pincode") || body.pincode || "",
      },
      area: {
        size: Number(getVal(body, "area", "size") || body.areaSize || 0),
        unit: getVal(body, "area", "unit") || body.areaUnit || "sqft",
      },
      furnished: body.furnished || "unfurnished",
    };

    if (req.files?.length) {
      data.images = req.files.map((f, i) => ({
        url: f.path,
        public_id: f.filename,
        isCover: i === 0,
      }));
    }

    if (body.latitude && body.longitude) {
      data.location = {
        type: "Point",
        coordinates: [parseFloat(body.longitude), parseFloat(body.latitude)],
      };
    }

    const property = await Property.create(data);

    // Reliable Role Management: Auto-upgrade 'user' to 'owner' if they just posted a property
    if (req.user.role === "user") {
      await User.findByIdAndUpdate(req.user._id, { role: "owner" });
    }

    res.status(201).json({ success: true, message: "Property submitted for approval", data: property });
  } catch (err) {
    console.error("Property Creation Error:", err);
    next(err);
  }
};

// @route   PUT /api/v1/properties/:id
exports.updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, isDeleted: false });
    if (!property) return res.status(404).json({ success: false, message: "Property not found" });

    // Only owner or admin can update
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const body = req.body;
    const getVal = (obj, key, nestedKey) => {
      if (obj[key] && typeof obj[key] === "object" && obj[key][nestedKey]) return obj[key][nestedKey];
      return obj[`${key}[${nestedKey}]`];
    };

    const updates = {
      title: body.title,
      description: body.description,
      price: body.price ? Number(body.price) : undefined,
      propertyType: body.propertyType,
      listingType: body.listingType,
      bedrooms: body.bedrooms ? Number(body.bedrooms) : undefined,
      bathrooms: body.bathrooms ? Number(body.bathrooms) : undefined,
      address: {
        street: getVal(body, "address", "street") || body.address,
        city: getVal(body, "address", "city") || body.city,
        state: getVal(body, "address", "state") || body.state,
        pincode: getVal(body, "address", "pincode") || body.pincode,
      },
      area: {
        size: getVal(body, "area", "size") ? Number(getVal(body, "area", "size")) : (body.areaSize ? Number(body.areaSize) : undefined),
        unit: getVal(body, "area", "unit") || body.areaUnit,
      },
      furnished: body.furnished,
    };

    // Remove undefined fields for update
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);
    if (updates.address) {
       Object.keys(updates.address).forEach(key => updates.address[key] === undefined && delete updates.address[key]);
       if (Object.keys(updates.address).length === 0) delete updates.address;
    }
    if (updates.area) {
       Object.keys(updates.area).forEach(key => updates.area[key] === undefined && delete updates.area[key]);
       if (Object.keys(updates.area).length === 0) delete updates.area;
    }

    if (req.files?.length) {
      if (!updates.$push) updates.$push = {};
      updates.$push.images = req.files.map((f) => ({ 
        url: f.path,
        public_id: f.filename 
      }));
    }

    const updated = await Property.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Property Update Error:", err);
    next(err);
  }
};

// @route   DELETE /api/v1/properties/:id (soft delete)
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, isDeleted: false });
    if (!property) return res.status(404).json({ success: false, message: "Property not found" });

    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await Property.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.json({ success: true, message: "Property deleted" });
  } catch (err) { next(err); }
};

// @route   GET /api/v1/properties/my-listings
exports.getMyListings = async (req, res, next) => {
  try {
    const properties = await Property.find({ owner: req.user._id, isDeleted: false }).sort({ createdAt: -1 });
    res.json({ success: true, count: properties.length, data: properties });
  } catch (err) { next(err); }
};
