const express = require("express");
const router = express.Router();
const { createProperty, getProperties, changePropertyStatus, deleteProperty } = require("../controllers/property");
const userAuth = require("../middleware/auth");

router.post("/properties-create",createProperty);
router.get("/get-properties",getProperties);
router.patch("/changePropertyStatus/:id",userAuth,changePropertyStatus);
router.delete("/deleteProperty/:id",userAuth,deleteProperty);

module.exports = router;
