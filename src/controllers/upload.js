const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../configure/uploads");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "properties",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

const uploadImages = async (req, res) => {
  try {
    const urls = req.files.map((file) => file.path);
    res.status(200).json({ urls });
  } catch (error) {
    res.status(500).json({ message: "Image upload failed", error });
  }
};

module.exports = { upload, uploadImages };
