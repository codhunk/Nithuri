require("dotenv").config();
const mongoose = require("mongoose");
const Project = require("../modules/labour/project.model");

const dummyProjects = [
  {
    project_name: "Luxury Villa Painting",
    location: "Bandra West, Mumbai",
    number_of_labours_needed: 5,
    budget: 15000,
    required_skills: ["Painter"],
    start_date: new Date(Date.now() + 86400000 * 2), // 2 days from now
    end_date: new Date(Date.now() + 86400000 * 7),
  },
  {
    project_name: "High-Rise Plumbing Fix",
    location: "Andheri East, Mumbai",
    number_of_labours_needed: 2,
    budget: 5000,
    required_skills: ["Plumber"],
    start_date: new Date(Date.now() + 86400000 * 1),
    end_date: new Date(Date.now() + 86400000 * 3),
  },
  {
    project_name: "Commercial Electrical Wiring",
    location: "Whitefield, Bangalore",
    number_of_labours_needed: 4,
    budget: 20000,
    required_skills: ["Electrician"],
    start_date: new Date(Date.now() + 86400000 * 5),
    end_date: new Date(Date.now() + 86400000 * 15),
  },
  {
    project_name: "Custom Furniture Setup",
    location: "Koramangala, Bangalore",
    number_of_labours_needed: 3,
    budget: 12000,
    required_skills: ["Carpenter"],
    start_date: new Date(Date.now() + 86400000 * 3),
    end_date: new Date(Date.now() + 86400000 * 6),
  },
  {
    project_name: "POP Ceiling Design",
    location: "Viman Nagar, Pune",
    number_of_labours_needed: 4,
    budget: 18000,
    required_skills: ["POP Worker", "Painter"],
    start_date: new Date(Date.now() + 86400000 * 4),
    end_date: new Date(Date.now() + 86400000 * 10),
  },
  {
    project_name: "Construction Site Clearance",
    location: "Hinjewadi, Pune",
    number_of_labours_needed: 10,
    budget: 8000,
    required_skills: ["General Labour"],
    start_date: new Date(Date.now() + 86400000 * 1),
    end_date: new Date(Date.now() + 86400000 * 2),
  },
  {
    project_name: "Hotel Renovation Project",
    location: "Calangute, Goa",
    number_of_labours_needed: 15,
    budget: 150000,
    required_skills: ["Carpenter", "Plumber", "Electrician", "Painter"],
    start_date: new Date(Date.now() + 86400000 * 10),
    end_date: new Date(Date.now() + 86400000 * 40),
  },
  {
    project_name: "Farmhouse Exterior Painting",
    location: "Lonavala, Maharashtra",
    number_of_labours_needed: 6,
    budget: 25000,
    required_skills: ["Painter", "General Labour"],
    start_date: new Date(Date.now() + 86400000 * 7),
    end_date: new Date(Date.now() + 86400000 * 14),
  },
  {
    project_name: "Office Space Partitioning",
    location: "Cyber City, Gurugram",
    number_of_labours_needed: 5,
    budget: 30000,
    required_skills: ["Carpenter", "General Labour"],
    start_date: new Date(Date.now() + 86400000 * 2),
    end_date: new Date(Date.now() + 86400000 * 8),
  },
  {
    project_name: "Mansion Pipe Maintenance",
    location: "Banjara Hills, Hyderabad",
    number_of_labours_needed: 2,
    budget: 6000,
    required_skills: ["Plumber"],
    start_date: new Date(Date.now() + 86400000 * 1),
    end_date: new Date(Date.now() + 86400000 * 2),
  }
];

const seedProjects = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB...");

    await Project.insertMany(dummyProjects);
    console.log("✅ Successfully seeded 10 projects!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed Error:", err);
    process.exit(1);
  }
};

seedProjects();
