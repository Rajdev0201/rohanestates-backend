const Property = require("../model/property");

exports.createProperty = async (req, res) => {
  try {
    const {
      type,
      name,
      description,

      country,
      state,
      city,
      zipCode,
      address,

      price,
      totalArea,
      status,
      constructionYear,

      bedrooms,
      bathrooms,
      garages,
      elevator,
      parking,
      wifi,
      cableTV,
      agentName,
      agentEmail,
      agentPhone,
      images,
    } = req.body;

    // 🔴 REQUIRED VALIDATIONS
    if (!type)
      return res
        .status(400)
        .json({ success: false, message: "Property type is required" });
    if (!name)
      return res
        .status(400)
        .json({ success: false, message: "Property name is required" });
    if (!description)
      return res
        .status(400)
        .json({ success: false, message: "Description is required" });

    if (!country || !state || !city || !address)
      return res
        .status(400)
        .json({ success: false, message: "Complete address is required" });

    if (!price)
      return res
        .status(400)
        .json({ success: false, message: "Price is required" });
    if (!totalArea)
      return res
        .status(400)
        .json({ success: false, message: "Total area is required" });

    if (!bedrooms)
      return res
        .status(400)
        .json({ success: false, message: "Bedrooms are required" });
    if (!bathrooms)
      return res
        .status(400)
        .json({ success: false, message: "Bathrooms are required" });

    if (!images || images.length === 0)
      return res
        .status(400)
        .json({ success: false, message: "At least one image is required" });

    // ✅ CREATE PROPERTY
    const property = new Property({
      type,
      name,
      description,

      country,
      state,
      city,
      zipCode,
      address,

      price,
      totalArea,
      status,
      constructionYear,

      bedrooms,
      bathrooms,
      garages,
      elevator,
      parking,
      wifi,
      cableTV,
      agentName,
      agentEmail,
      agentPhone,
      images,
    });

    await property.save();

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create property",
    });
  }
};

exports.getProperties = async (req, res) => {
  try {
    const { type, status, fromDate, toDate, page = 1, limit = 10 } = req.query;

    const query = {};

    // 🔹 Filters
    if (type) query.type = type;
    if (status) query.status = status;

    if (fromDate && toDate) {
      query.createdAt = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    }

    // 🔹 Pagination
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Property.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Property.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};



exports.changePropertyStatus = async (req, res) => {
  const user = req.user;
    if (user.type !== "admin") {
        return res.status(403).json({ message: "Access denied" });
    }
    try {
        const { id} = req.params;
        const { status } = req.body;

        if(!id || !status){
            return res.status(400).json({message:"Property ID and status are required"});
        }
        const property = await Property.findById(id);
        if(!property){
            return res.status(404).json({message:"Property not found"});
        }
        property.status = status;
        await property.save();
        res.status(200).json({message:"Property status updated successfully"});
    }catch(err){
        res.status(500).json({message:"Server Error," + err.message});
    }
}


exports.deleteProperty = async (req, res) => {
    const user = req.user;
    if (user.type !== "admin") {
        return res.status(403).json({ message: "Access denied" });
    }
    try{
        const { id} = req.params;
        if(!id){
            return res.status(400).json({message:"Property ID is required"});
        }
        const property = await Property.findByIdAndDelete(id);
        if(!property){
            return res.status(404).json({message:"Property not found"});
        }
        res.status(200).json({message:"Property deleted successfully"});
    }catch(err){
        res.status(500).json({message:"Server Error," + err.message});
    }
}