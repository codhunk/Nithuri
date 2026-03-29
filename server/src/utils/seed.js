const User = require("../modules/user/user.model");
const bcrypt = require("bcryptjs");

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@nithuri.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      // Update password to ensure it's matched with the correct schema hashing
      admin.password = adminPassword;
      await admin.save();
      console.log("ℹ️ Admin password synchronized.");
      return;
    }

    admin = await User.create({
      name: "Nithuri Admin",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
      isVerified: true,
      phone: "9999999999"
    });

    console.log("✅ Admin user seeded successfully:", admin.email);
  } catch (error) {
    console.error("❌ Admin seeding error:", error.message);
  }
};

module.exports = seedAdmin;
