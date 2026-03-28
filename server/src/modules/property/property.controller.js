const Property = require("./property.model");

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
    // Multer doesn't nest objects like 'address[city]', so we restructure manually
    const data = {
      owner: req.user._id,
      title: req.body.title,
      description: req.body.description,
      price: Number(req.body.price),
      propertyType: req.body.propertyType,
      listingType: req.body.listingType,
      bedrooms: Number(req.body.bedrooms || 0),
      bathrooms: Number(req.body.bathrooms || 0),
      address: {
        street: req.body["address[street]"] || req.body.address,
        city: req.body["address[city]"],
        state: req.body["address[state]"],
        pincode: req.body["address[pincode]"],
      },
      area: {
        size: Number(req.body["area[size]"] || req.body.areaSize),
        unit: req.body["area[unit]"] || "sqft",
      },
    };

    if (req.files?.length) {
      data.images = req.files.map((f, i) => ({
        url: `/uploads/properties/${f.filename}`,
        isCover: i === 0,
      }));
    }

    if (req.body.latitude && req.body.longitude) {
      data.location = {
        type: "Point",
        coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)],
      };
    }

    const property = await Property.create(data);
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

    const updates = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price ? Number(req.body.price) : undefined,
      propertyType: req.body.propertyType,
      listingType: req.body.listingType,
      bedrooms: req.body.bedrooms ? Number(req.body.bedrooms) : undefined,
      bathrooms: req.body.bathrooms ? Number(req.body.bathrooms) : undefined,
      address: {
        street: req.body["address[street]"] || req.body.address,
        city: req.body["address[city]"],
        state: req.body["address[state]"],
        pincode: req.body["address[pincode]"],
      },
      area: {
        size: req.body["area[size]"] ? Number(req.body["area[size]"]) : (req.body.areaSize ? Number(req.body.areaSize) : undefined),
        unit: req.body["area[unit]"],
      },
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
      updates.$push.images = req.files.map((f) => ({ url: `/uploads/properties/${f.filename}` }));
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
