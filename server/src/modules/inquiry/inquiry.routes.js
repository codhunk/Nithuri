const express = require("express");
const router = express.Router();
const { createInquiry, getMyInquiries, updateInquiryStatus } = require("./inquiry.controller");
const { protect, authorize } = require("../../middlewares/auth.middleware");

router.post("/", createInquiry);
router.get("/my", protect, authorize("owner", "admin"), getMyInquiries);
router.put("/:id/status", protect, authorize("owner", "admin"), updateInquiryStatus);

module.exports = router;
