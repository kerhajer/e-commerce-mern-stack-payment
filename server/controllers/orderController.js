const order = require("../models/orderschema");




const getorder = async (req, res) => {
    try {
      const currentuserId = req.userId; // Ensure this is set correctly by your authentication middleware
  
      // Find orders by userId
      const orderList = await order.find({ userId: currentuserId }).populate('userId')
  
      if (!orderList || orderList.length === 0) {
        return res.status(404).json({ message: "No orders found" });
      }
  
      res.json({ orderList });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  const getAllorder = async (req, res) => {
    try {
      const orders = await order
        .find()
        .sort({ createdAt: -1 })
       
        .populate('userId')
  

        .lean();
  
      // Check if carts array is empty
      if (!orders.length) {
        return res.status(404).json({ message: 'No order found' });
      }
  
      // Send carts data in the response
      res.json({ orders, message: 'Carts retrieved successfully' });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  











  module.exports= {getorder,getAllorder} 