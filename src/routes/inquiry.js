const express = require("express");
const { createInquiry, getInquiries, changeInquiryStatus, deleteInquiry } = require("../controllers/inquiry");
const userAuth = require("../middleware/auth");
const router = express.Router();


router.post("/createInquiry",createInquiry);
router.get("/getInquiries",userAuth,getInquiries);
router.patch("/changeStatus/:id",userAuth,changeInquiryStatus);
router.delete("/deleteInquiry/:id",userAuth,deleteInquiry);

module.exports = router;