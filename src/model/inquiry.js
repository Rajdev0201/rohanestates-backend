const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    inquiryType: {
      type: String,
      required: true,
      enum: ["Buy", "Rent"],
    },

    howToAddress: {
      type: String,
      enum: ["Mr", "Ms"],
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
    },

    personnelRole: {
      type: String,
      enum: ["Owner", "Agent"],
    },

    maxPrice: {
      type: String,
    },

    minSize: {
      type: String,
    },

    msg: {
      type: String,
    },
    status:{
        type:String,
        default:"New"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inquiry", inquirySchema);