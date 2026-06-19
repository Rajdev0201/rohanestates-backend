const express = require("express");
const { createSellProperty } = require("../controllers/sell");
const router = express.Router();

router.post("/sellproperty",createSellProperty)

module.exports = router;
