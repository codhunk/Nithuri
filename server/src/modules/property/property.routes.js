const express = require("express");
const router = express.Router();
const {
  getAllProperties, getPropertyById, createProperty, updateProperty, deleteProperty, getMyListings,
} = require("./property.controller");
const { protect, authorize } = require("../../middlewares/auth.middleware");
const upload = require("../../middlewares/upload.middleware");

router.use((req, res, next) => { req.uploadFolder = "properties"; next(); });

router.get("/", getAllProperties);
router.get("/my-listings", protect, authorize("owner", "admin"), getMyListings);
router.get("/:id", getPropertyById);
router.post("/", protect, authorize("owner", "admin"), upload.array("images", 10), createProperty);
router.put("/:id", protect, authorize("owner", "admin"), upload.array("images", 10), updateProperty);
router.delete("/:id", protect, authorize("owner", "admin"), deleteProperty);

module.exports = router;
