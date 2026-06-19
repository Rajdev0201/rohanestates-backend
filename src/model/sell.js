const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema({
  ownerName: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  category: { type: String, required: true },
  currentCountry:{ type:Object, required: true },
  currentState:{ type:Object, required: true },
  city: { type:Object, required: true },
  locality: String,
  address: String,
  totalArea: Number,
  areaUnit: String,
  approvalStatus: String,
  facing: String,
  bhk: String,
  builtUpArea: Number,
  furnishing: String,
  buildingAge: String,
  floorNumber: String,

  expectedPrice: { type: Number, required: true },
  images: [String],
  notes: String
}, { timestamps: true });

module.exports = mongoose.model("sellProperty", PropertySchema);
