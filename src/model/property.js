const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    type: String,
    name: String,
    description: String,

    country: String,
    state: String,
    city: String,
    zipCode: String,
    address: String,

    price: Number,
    totalArea: Number,
    status: String,
    constructionYear: Number,

    bedrooms: Number,
    bathrooms: Number,
    garages: Number,
    elevator: Number,

    parking: Boolean,
    wifi: Boolean,
    cableTV: Boolean,

    agentName: String,
    agentEmail: String,
    agentPhone: String,

    images: [String],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Property", propertySchema);
