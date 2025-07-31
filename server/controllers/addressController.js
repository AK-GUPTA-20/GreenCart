import Address from "../models/Address.js";

//* Add Address: /api/address/add
export const addAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const userId = req.userId; // Get userId from authUser middleware
    
    console.log("Adding address for userId:", userId);
    console.log("Address data:", address);
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }
    
    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Address data is required",
      });
    }
    
    // Create address with userId from middleware
    const newAddress = await Address.create({ 
      ...address, 
      userId 
    });
    
    console.log("Address created successfully:", newAddress._id);
    
    res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: newAddress
    });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add address",
      error: error.message,
    });
  }
};

//* Get Address: /api/address/get
export const getAddress = async (req, res) => {
  try {
    const userId = req.userId; // Get userId from authUser middleware, not params
    
    console.log("Fetching addresses for userId:", userId);
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }
    
    const addresses = await Address.find({ userId });
    
    console.log(`Found ${addresses.length} addresses for user ${userId}`);

    res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
      error: error.message,
    });
  }
};