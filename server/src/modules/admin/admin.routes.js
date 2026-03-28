const express = require("express");
const router = express.Router();
const {
  getDashboardStats, getAllUsers, blockUser,
  getAllPropertiesAdmin, approveProperty, forceDeleteProperty,
} = require("./admin.controller");
const { protect, authorize } = require("../../middlewares/auth.middleware");

router.use(protect, authorize("admin")); // All admin routes locked to admin role

router.get("/stats", getDashboardStats);
router.get("/users", getAllUsers);
router.put("/users/:id/block", blockUser);
router.get("/properties", getAllPropertiesAdmin);
router.put("/properties/:id/approve", approveProperty);
router.delete("/properties/:id", forceDeleteProperty);

module.exports = router;
