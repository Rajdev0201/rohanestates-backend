const Property = require("../model/sell");

exports.createSellProperty = async (req, res) => {
  try {
    const {
      ownerName,
      phone,
      email,
      category,
      currentCountry,
      currentState,
      city,
      locality,
      address,
      totalArea,
      areaUnit,
      approvalStatus,
      facing,
      bhk,
      builtUpArea,
      furnishing,
      buildingAge,
      floorNumber,
      images,
      expectedPrice,
      notes,
    } = req.body;


    if (
      !ownerName ||
      !phone ||
      !category ||
      !currentCountry ||
      !currentState ||
      !city ||
      !expectedPrice
    ) {
      return res.status(400).json({
        message: "Owner, category, location and price details are required",
      });
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        message: "Invalid phone number",
      });
    }

    if (category === "Vacant Plot / Land") {
      if (!totalArea || !areaUnit || !approvalStatus || !facing) {
        return res.status(400).json({
          message:
            "Total area, unit, approval status and facing are required for land",
        });
      }
    }

    if (
      category === "Apartment / Flat" ||
      category === "Independent House / Villa"
    ) {
      if (!bhk || !builtUpArea || !furnishing || !buildingAge) {
        return res.status(400).json({
          message:
            "BHK, built-up area, furnishing and building age are required",
        });
      }

      if (category === "Apartment / Flat" && !floorNumber) {
        return res.status(400).json({
          message: "Floor number is required for apartments",
        });
      }
    }

    const property = await Property.create({
      ownerName,
      phone,
      email,
      category,
      currentCountry,
      currentState,
      city,
      locality,
      address,

      totalArea,
      areaUnit,
      approvalStatus,
      facing,

      bhk,
      builtUpArea,
      furnishing,
      buildingAge,
      floorNumber,

      expectedPrice,
      images,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: property,
    });
  } catch (error) {
    console.error("Create Property Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
