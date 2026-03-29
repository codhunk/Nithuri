const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: (req) => `nithuri/${req.uploadFolder || "misc"}`,
    resource_type: "auto",
    public_id: (req, file) => {
      const name = file.originalname.split(".")[0];
      return `${Date.now()}-${name}`;
    },
  },
});

module.exports = { cloudinary, storage };
