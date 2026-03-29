const User = require("./user.model");
const Property = require("../property/property.model");

// @route   GET /api/v1/users/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites", "title price images address status");
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

// @route   PUT /api/v1/users/me
exports.updateMe = async (req, res, next) => {
  try {
    const { name, phone, bio } = req.body;
    const updates = { name, phone, bio };
    if (req.file) updates.avatar = req.file.path;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

// @route   PUT /api/v1/users/me/change-password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: "Password updated" });
  } catch (err) { next(err); }
};

// @route   POST /api/v1/users/favorites/:propertyId
exports.toggleFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const user = await User.findById(req.user._id);
    const index = user.favorites.indexOf(propertyId);

    if (index === -1) {
      user.favorites.push(propertyId);
    } else {
      user.favorites.splice(index, 1);
    }
    await user.save();

    res.json({ success: true, message: index === -1 ? "Added to favorites" : "Removed from favorites", favorites: user.favorites });
  } catch (err) { next(err); }
};

// @route   GET /api/v1/users/favorites
exports.getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "favorites",
      match: { isDeleted: false, status: "approved" },
      select: "title price images address propertyType listingType",
    });
    res.json({ success: true, data: user.favorites });
  } catch (err) { next(err); }
};
