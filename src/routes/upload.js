const express = require("express");
const router = express.Router();
const {
  upload,
  uploadImages,
} = require("../controllers/upload");

router.post("/upload", upload.array("images", 5), uploadImages);

module.exports = router;
