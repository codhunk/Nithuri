const express = require("express");
const { protect, authorize } = require("../../middlewares/auth.middleware");
const upload = require("../../middlewares/upload.middleware");

const {
  registerLabour,
  loginLabour,
  getLabourList,
  getLabourById,
  updateLabour,
  deleteLabour,
  createProject,
  getAllProjects,
  applyForProject,
  assignLabour,
  getAssignedLabours,
  updateAssignmentStatus,
  getApplications,
  getMyAssignments
} = require("./labour.controller");

const router = express.Router();

// Labour routes
router.get("/projects", getAllProjects); // Public route
router.post(
  "/register", 
  upload.fields([{ name: "profile_image", maxCount: 1 }, { name: "documents", maxCount: 1 }]), 
  registerLabour
);

router.post("/login", loginLabour);

router.get("/list", protect, authorize("admin"), getLabourList);

// Project/Assignment routes
router.post("/project", protect, authorize("admin", "user", "owner"), createProject);
router.get("/applications", protect, authorize("admin", "user", "owner"), getApplications);
router.get("/my-assignments", getMyAssignments);
router.post("/apply", applyForProject); // Labour auth inside controller

router.post("/assign-labour", protect, authorize("admin"), assignLabour);
router.get("/project/:id/labours", protect, authorize("admin"), getAssignedLabours);
router.put("/assignment/status/:id", protect, authorize("admin"), updateAssignmentStatus);

// Dynamic routes with :id must be at the bottom
router.get("/:id", protect, authorize("admin"), getLabourById);
router.put("/update/:id", protect, authorize("admin"), updateLabour);
router.delete("/:id", protect, authorize("admin"), deleteLabour);

module.exports = router;
