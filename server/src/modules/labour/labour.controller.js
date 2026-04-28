const Labour = require("./labour.model");
const Project = require("./project.model");
const Assignment = require("./assignment.model");
const jwt = require("jsonwebtoken");
const { getIO } = require("../../config/socket");
const User = require("../user/user.model");

const generateTokens = (id) => {
  const accessToken = jwt.sign({ id, role: "labour" }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });
  return { accessToken };
};

// @desc    Register a new labour
// @route   POST /api/v1/labour/register
exports.registerLabour = async (req, res, next) => {
  try {
    const { name, phone, password, skill_type, experience, wage, location, availability } = req.body;
    
    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required" });
    }

    const existingLabour = await Labour.findOne({ phone });
    if (existingLabour) return res.status(400).json({ success: false, message: "Phone number already registered" });

    const profile_image = req.files?.profile_image ? `/uploads/${req.files.profile_image[0].filename}` : null;
    const documents = req.files?.documents ? `/uploads/${req.files.documents[0].filename}` : null;

    const newLabour = await Labour.create({
      name, phone, password, skill_type, experience, wage, location, availability, profile_image, documents
    });

    res.status(201).json({ success: true, data: newLabour });
  } catch (err) { next(err); }
};

// @desc    Login labour
// @route   POST /api/v1/labour/login
exports.loginLabour = async (req, res, next) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) return res.status(400).json({ success: false, message: "Phone and password required" });

    const labour = await Labour.findOne({ phone }).select("+password");
    if (!labour) return res.status(404).json({ success: false, message: "Labour not found" });

    if (!(await labour.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const { accessToken } = generateTokens(labour._id);

    // Get current assignments
    const assignments = await Assignment.find({ labour_id: labour._id }).populate("project_id");

    res.json({
      success: true,
      message: "Login successful",
      data: {
        _id: labour._id,
        name: labour.name,
        phone: labour.phone,
        skill_type: labour.skill_type,
        availability: labour.availability,
        profile_image: labour.profile_image,
        assignments
      },
      accessToken,
    });
  } catch (err) { next(err); }
};

// @desc    Get all registered labour (Admin panel)
// @route   GET /api/v1/labour/list
exports.getLabourList = async (req, res, next) => {
  try {
    const { skill_type, availability } = req.query;
    const filter = {};
    if (skill_type) filter.skill_type = skill_type;
    if (availability) filter.availability = availability;

    const labours = await Labour.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: labours.length, data: labours });
  } catch (err) { next(err); }
};

// @desc    Get a single labour by ID
// @route   GET /api/v1/labour/:id
exports.getLabourById = async (req, res, next) => {
  try {
    const labour = await Labour.findById(req.params.id);
    if (!labour) return res.status(404).json({ success: false, message: "Labour not found" });
    res.status(200).json({ success: true, data: labour });
  } catch (err) { next(err); }
};

// @desc    Update labour details
// @route   PUT /api/v1/labour/update/:id
exports.updateLabour = async (req, res, next) => {
  try {
    const labour = await Labour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!labour) return res.status(404).json({ success: false, message: "Labour not found" });
    res.status(200).json({ success: true, data: labour });
  } catch (err) { next(err); }
};

// @desc    Delete a labour
// @route   DELETE /api/v1/labour/:id
exports.deleteLabour = async (req, res, next) => {
  try {
    const labour = await Labour.findByIdAndDelete(req.params.id);
    if (!labour) return res.status(404).json({ success: false, message: "Labour not found" });
    res.status(200).json({ success: true, message: "Labour deleted successfully" });
  } catch (err) { next(err); }
};

// @desc    Get all projects
// @route   GET /api/v1/labour/projects
exports.getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (err) { next(err); }
};

// @desc    Labourer applies for a project
// @route   POST /api/v1/labour/apply
exports.applyForProject = async (req, res, next) => {
  try {
    const { project_id } = req.body;
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    
    if (!token) return res.status(401).json({ success: false, message: "Not authorized to apply" });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "labour") return res.status(403).json({ success: false, message: "Only labourers can apply" });
    
    const labour_id = decoded.id;
    const project = await Project.findById(project_id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    const labour = await Labour.findById(labour_id);
    if (!labour) return res.status(404).json({ success: false, message: "Labour not found" });

    // Check if already applied/assigned
    const existingAssignment = await Assignment.findOne({ labour_id, project_id });
    if (existingAssignment) {
      return res.status(400).json({ success: false, message: "You have already applied or been assigned to this work" });
    }

    const assignment = await Assignment.create({ labour_id, project_id, status: "pending" });
    
    // We could update availability, but usually "pending" means waiting for approval.
    // For now we'll mark them Not Available if they apply.
    labour.availability = "Not Available";
    await labour.save();

    try {
      const io = getIO();
      if (project.posted_by) {
        // Emit to the specific user who posted the project
        io.to(project.posted_by.toString()).emit("labour_notification", {
          title: "New Labour Application",
          message: `${labour.name} (${labour.skill_type}) applied for your work: ${project.project_name}`
        });
      } else {
        // If no posted_by, find all admins and notify them
        const admins = await User.find({ role: "admin" }).select("_id");
        admins.forEach(admin => {
          io.to(admin._id.toString()).emit("labour_notification", {
            title: "New Labour Application",
            message: `${labour.name} (${labour.skill_type}) applied for ${project.project_name}`
          });
        });
      }
    } catch (e) {
      console.log("Socket notification failed:", e.message);
    }

    res.status(201).json({ success: true, data: assignment, message: "Successfully applied for the work!" });
  } catch (err) { next(err); }
};

// @desc    Get logged in labour's assignments
// @route   GET /api/v1/labour/my-assignments
exports.getMyAssignments = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) return res.status(401).json({ success: false, message: "Not authorized" });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "labour") return res.status(403).json({ success: false, message: "Only labourers can access this" });

    const assignments = await Assignment.find({ labour_id: decoded.id }).populate("project_id").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: assignments.length, data: assignments });
  } catch (err) { next(err); }
};

// @desc    Create project (Nithuri setup)
// @route   POST /api/v1/labour/project
exports.createProject = async (req, res, next) => {
  try {
    const project = await Project.create({ ...req.body, posted_by: req.user.id });
    res.status(201).json({ success: true, data: project });
  } catch (err) { next(err); }
};

// @desc    Auto-assign labour based on project requirements
// @route   POST /api/v1/labour/assign-labour
exports.assignLabour = async (req, res, next) => {
  try {
    const { project_id, manual_labour_id } = req.body;

    let project = null;
    if (project_id) {
      project = await Project.findById(project_id);
    } else {
      // Default to Nithuri Project if not provided
      project = await Project.findOne({ project_name: "Nithuri Project" });
    }
    
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    // Manual Assignment Override
    if (manual_labour_id) {
      const labour = await Labour.findById(manual_labour_id);
      if (!labour) return res.status(404).json({ success: false, message: "Labour not found" });
      
      const existingAssignment = await Assignment.findOne({ labour_id: labour._id, project_id: project._id });
      if (existingAssignment) return res.status(400).json({ success: false, message: "Labour is already assigned to this project" });

      const assignment = await Assignment.create({ labour_id: labour._id, project_id: project._id });
      // Update availability
      labour.availability = "Not Available";
      await labour.save();

      return res.status(201).json({ success: true, data: assignment, message: "Manual assignment successful" });
    }

    // Auto-Assignment Logic
    // Find available labour matching the required skills
    const availableLabours = await Labour.find({
      skill_type: { $in: project.required_skills },
      availability: "Available"
    }).sort({ experience: -1 }); // Sort by experience, highest first

    if (availableLabours.length === 0) {
      return res.status(404).json({ success: false, message: "No available labour matching project requirements found" });
    }

    // Get current assignment count for project
    const currentAssignments = await Assignment.countDocuments({ project_id: project._id, status: { $ne: "completed" } });
    
    let needed = project.number_of_labours_needed - currentAssignments;
    if (needed <= 0) {
      return res.status(200).json({ success: true, message: "Project already has enough labours assigned" });
    }

    const assignedLabours = [];
    for (let i = 0; i < Math.min(needed, availableLabours.length); i++) {
      const labour = availableLabours[i];
      
      // Create assignment
      const assignment = await Assignment.create({ labour_id: labour._id, project_id: project._id });
      
      // Update labour status
      labour.availability = "Not Available";
      await labour.save();

      assignedLabours.push(assignment);
    }

    res.status(201).json({ 
      success: true, 
      message: `Auto-assigned ${assignedLabours.length} labours successfully`, 
      data: assignedLabours 
    });
  } catch (err) { next(err); }
};

// @desc    Get pending applications for projects
// @route   GET /api/v1/labour/applications
exports.getApplications = async (req, res, next) => {
  try {
    let query = { status: "pending" };
    
    if (req.user.role !== "admin") {
      const userProjects = await Project.find({ posted_by: req.user.id }).select('_id');
      const projectIds = userProjects.map(p => p._id);
      query.project_id = { $in: projectIds };
    }

    const applications = await Assignment.find(query)
      .populate("labour_id")
      .populate("project_id")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (err) { next(err); }
};

// @desc    Get assigned labour for Nithuri Project
// @route   GET /api/v1/labour/project/:id/labours
exports.getAssignedLabours = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const assignments = await Assignment.find({ project_id: projectId }).populate("labour_id");
    res.status(200).json({ success: true, count: assignments.length, data: assignments });
  } catch (err) { next(err); }
};

// @desc    Update assignment status
// @route   PUT /api/v1/labour/assignment/status/:id
exports.updateAssignmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found" });

    assignment.status = status;
    await assignment.save();

    // If completed or rejected, make labour available again
    if (status === "completed" || status === "rejected") {
      await Labour.findByIdAndUpdate(assignment.labour_id, { availability: "Available" });
    }

    res.status(200).json({ success: true, data: assignment });
  } catch (err) { next(err); }
};
