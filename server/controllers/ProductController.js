const product = require("../models/productschema")
const uploadProductPermission = require("../Middlewares/Permisson")
const { AuthMiddleWare } = require("../Middlewares/AuthMiddleWare")





const filterProductController = async (req, res) => {
  try {
      const categoryList = req?.body?.category || [];
      console.log("Received category list:", categoryList);

      if (categoryList.length === 0) {
          return res.json({
              data: [],
              message: "No categories provided",
              error: false,
              success: true
          });
      }

      const products = await product.find({
          category: {
              "$in": categoryList
          }
      });
      const filteredProductsByCategory = {};

      categoryList.forEach((category) => {
        const filteredProducts = products.filter((product) => product.category === category);
        filteredProductsByCategory[category] = filteredProducts;
      });
  
      // Send successful response with filtered products for each category
      res.json({
        data: filteredProductsByCategory,
        success: true,
        error: false,
      });
     
  } catch (err) {
      console.error("Error retrieving products:", err);
      res.json({
          message: err.message || err,
          error: true,
          success: false
      });
  }
};





const addProduct = async (req, res) => {
    try {
      // 1. Check for existing userId or retrieve it (if not available)
      const userId = req.userId || AuthMiddleWare(req.headers.authorization); // Assuming userId retrieval from token
  
      // 2. Permission check with logging
      const authorized = await uploadProductPermission(userId);
      console.log(`User with ID ${userId} has permission: ${authorized}`); // Log for debugging
      if (!authorized) {
        throw new Error("Permission denied: You need admin rights to add products");
      }
  
      // 3. Extract product data from request body
      const { productName, brandName, category, imgUrl, videoUrl, description, price, sellingPrice, tag } = req.body;
  
      // 4. Create a new product object with owner set to requesting user
      const newProduct = await product.create({
        userId,
        productName,
        owner: userId, // Maintain original userId for tracking
        brandName,
        category,
        imgUrl,
        videoUrl,
        description,
        price,
        sellingPrice,
        tag,
        // Add other fields as needed (likes, dislikes)
      });
  
      // 5. Successful product creation, send response
      res.json({newProduct, msg : "Product upload successfully"});
    } catch (error) {
      // 6. Specific error handling
      if (error.name === 'ValidationError') {
        res.status(400).json({ msg: error.message }); // Handle validation errors
      } else {
        console.error("Error adding product:", error); // Log other errors for debugging
        res.status(500).json({ msg: "Internal server error" });
      }
    }
  };
  
const searchProduct = async(req,res)=>{
    try{
        const query = req.query.q 

        const regex = new RegExp(query,'i','g')

        const products = await product.find({
            "$or" : [
                {
                    productName : regex
                },
                {
                    category : regex
                }
            ]
        })
            res.status(200).json(products);
          } catch (err) {
            next(err);
          }
        };

  

  

        const getCategoryWiseProduct = async (req, res) => {
          try {
            // Retrieve categories from request body or query parameters
            const { categories } = req?.body || req?.query;
        
            // Optional validation (replace with your validation logic)
            if (!categories || !Array.isArray(categories)) {
              return res.status(400).json({
                message: "Invalid categories parameter",
                error: true,
                success: false,
              });
            }
        
            const products = await product.find();
        
            const filteredProductsByCategory = {};
        
            // Filter products for each category
            categories.forEach((category) => {
              const filteredProducts = products.filter((product) => product.category === category);
              filteredProductsByCategory[category] = filteredProducts;
            });
        
            // Send successful response with filtered products for each category
            res.json({
              data: filteredProductsByCategory,
              success: true,
              error: false,
            });
          } catch (error) {
            console.error("Error fetching product:", error);
            res.status(400).json({
              message: error.message || error,
              error: true,
              success: false,
            });
          }
        };


const getCategoryProduct = async (req, res) => {
  try {
    // 1. Get distinct categories efficiently
    const distinctCategories = await product.distinct("category");

    // 2. Handle empty category case
    if (distinctCategories.length === 0) {
      return res.json({
        message: "No categories found",

      });
    }

    // 3. Use aggregation pipeline for efficient fetching
    const productByCategory = await product.aggregate([
      {
        $match: { category: { $in: distinctCategories } }, // Filter by distinct categories
      },
      {
        $group: {
          _id: "$category", // Group by category
          product: { $first: "$$ROOT" }, // Get the first product in each category
        },
      },
    ]);

    // 4. Extract products from aggregation results
    const products = productByCategory.map((categoryData) => categoryData.product);

    res.json(products);
  } catch (error) {
    console.error("Error fetching category products:", error);
    res.status(400).json(error);
  }
};

const getproductbyid = async (req, res, next) => {
    const productId = req.params.id; // Assuming the ID is in `req.params.id`
    product.findById(productId)
      .then(product => {
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
      })
      .catch(error => {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Internal server error" });
      });
  }
    const getAllproduct = async (req, res) => {
      try {
       
        const products = await product.find().sort({ createdAt : -1 })

       
        res.json(products);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };
    























    const  updateproduct=async(req,res)=>{
        try {
      
            const userId = req.userId || AuthMiddleWare(req.headers.authorization); // Assuming userId retrieval from token
  
            // 2. Permission check with logging
            const authorized = await uploadProductPermission(userId);
            console.log(`User with ID ${userId} has permission: ${authorized}`); // Log for debugging
            if (!authorized) {
              throw new Error("Permission denied: You need admin rights to add products");
            }
                
            const updatedproduct = await product.findByIdAndUpdate(req.params.id,req.body,{new:true})
            res.json({msg:'product has been updated successfully!',updatedproduct})
    
        } catch (error) {
            console.log(error);
        }
    }

    const  Deleteproduct=async(req,res)=>{
        try {
    
            const userId = req.userId || AuthMiddleWare(req.headers.authorization); // Assuming userId retrieval from token
  
            // 2. Permission check with logging
            const authorized = await uploadProductPermission(userId);
            console.log(`User with ID ${userId} has permission: ${authorized}`); // Log for debugging
            if (!authorized) {
              throw new Error("Permission denied: You need admin rights to add products");
            }
            const deletedproduct = await product.findByIdAndDelete(req.params.id)
            res.json({msg:'product has been deleted successfully!',deletedproduct})
        } catch (error) {
            console.log(error)
        }
    }
















module.exports = {filterProductController,getCategoryWiseProduct,getproductbyid,filterProductController,addProduct,Deleteproduct,updateproduct,searchProduct, getAllproduct,getCategoryWiseProduct,updateproduct,getCategoryProduct,getAllproduct}