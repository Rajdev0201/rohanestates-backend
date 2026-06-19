const Inquiry = require("../model/inquiry");


exports.createInquiry = async (req, res) => {
  const {
    inquiryType,
    howToAddress,
    name,
    email,
    personnelRole,
    maxPrice,
    minSize,
    msg,
  } = req.body;
  try {
    if (
      !inquiryType ||
      !name ||
      !email ||
      !personnelRole ||
      !msg ||
      !howToAddress ||
      !maxPrice ||
      !minSize
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const inquiry = new Inquiry({
      inquiryType,
      howToAddress,
      name,
      email,
      personnelRole,
      maxPrice,
      minSize,
      msg,
    });
    await inquiry.save();
    res.status(201).json({ message: "Inquiry created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error," + err.message });
  }
};

exports.getInquiries = async (req, res) => {
  const user = req.user;

  if (user.type !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const {
      inquiryType,
      status,
      fromDate,
      toDate,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // Filters
    if (inquiryType) query.inquiryType = inquiryType;
    if (status) query.status = status;

    if (fromDate && toDate) {
      query.createdAt = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    }

    //  Pagination
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Inquiry.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Inquiry.countDocuments(query),
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


exports.changeInquiryStatus = async (req, res) => {
  const user = req.user;
    if (user.type !== "admin") {
        return res.status(403).json({ message: "Access denied" });
    }
    try {
        const { id} = req.params;
        const { status } = req.body;

        if(!id || !status){
            return res.status(400).json({message:"inquiryId and status are required"});
        }
        const inquiry = await Inquiry.findById(id);
        if(!inquiry){
            return res.status(404).json({message:"Inquiry not found"});
        }
        inquiry.status = status;
        await inquiry.save();
        res.status(200).json({message:"Inquiry status updated successfully"});
    }catch(err){
        res.status(500).json({message:"Server Error," + err.message});
    }
}

exports.deleteInquiry = async (req, res) => {
    const user = req.user;
    if (user.type !== "admin") {
        return res.status(403).json({ message: "Access denied" });
    }
    try{
        const { id} = req.params;
        if(!id){
            return res.status(400).json({message:"inquiryId is required"});
        }
        const inquiry = await Inquiry.findByIdAndDelete(id);
        if(!inquiry){
            return res.status(404).json({message:"Inquiry not found"});
        }
        res.status(200).json({message:"Inquiry deleted successfully"});
    }catch(err){
        res.status(500).json({message:"Server Error," + err.message});
    }
}