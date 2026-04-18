const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // Multer errors
  if (err.name === "MulterError") {
    statusCode = 400;
    if (err.code === "LIMIT_FILE_SIZE") message = "File too large. Max limit is 10MB.";
    if (err.code === "LIMIT_FILE_COUNT") message = "Too many files. Max is 10.";
    if (err.code === "LIMIT_UNEXPECTED_FILE") message = "Unexpected file field or invalid format.";
  }

  // Cloudinary errors
  if (err.message && err.message.toLowerCase().includes("cloudinary")) {
    statusCode = 502;
    message = "Image upload failed. Please verify your Cloudinary storage settings.";
  }

  res.status(statusCode).json({
    success: false, 
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
