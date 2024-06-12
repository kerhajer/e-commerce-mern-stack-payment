const cart=require ("../models/cartschema");
const dotenv = require("dotenv").config();
const Stripe = require('stripe')




const addtocart = async (req, res) => {
  try {
    const { productId ,ownerId} = req.body;
    const userId = req.userId;

    // Check if the product is already in the cart for the current user
    const isProductAvailable = await cart.findOne({ productId, userId });

    if (isProductAvailable) {
      return res.json({
        message: "Already exists in Add to cart",
        success: false,
        error: true,
      });
    }

    const payload = {
      productId: productId,
      quantity: 1,
     userId,
      owner: ownerId,
    };

    const newCart = new cart(payload);
    const saveProduct = await newCart.save();

    return res.json({
      data: saveProduct,
      message: "Product Added in Cart",
      success: true,
      error: false,
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};




const updatecart = async (req, res) => {
  try {
 
    const updatedcart= await cart.findByIdAndUpdate(req.params.id,req.body,{new:true}).populate('owner', '-password -__v').populate('productId');
    res.json({msg:'  Product been updated successfully!',updatedcart})

} catch (error) {
    console.log(error);
}
};



const deleteCart = async (req, res) => {
  try{

    const deleteProduct = await cart.findByIdAndDelete(req.params.id)
    res.json({
        msg: "Product Deleted From Cart",
         deleteProduct
    })

}catch(err){
    res.json({
        message : err?.message || err,
        error : true,
        success : false
    })
}
}

  



const countAddToCartProduct = async(req,res)=>{
  try{
      const userId = req.userId

      const count = await cart.countDocuments({
          userId : userId
      })

      res.json(count)
  }catch(error){
      res.json( error.message || error)
  }
}


const getaddtocart = async (req, res, next) => {


    try{

      const carts = await cart.find({userId : req.userId}).populate('owner', '-password -__v').populate('productId').populate('userId').lean()

      const totalprice = carts.reduce((acc, item) => {
        return acc + item.quantity * item.productId.sellingPrice;
      }, 0);
    
    res.status(200).json({carts,totalprice});
  } catch (err) {
    next(err);
  }
};
const getAllcart = async (req, res) => {
  try {
    // Fetch all carts, populate owner and productId fields, and sort by creation date
    const carts = await cart
      .find()
      .sort({ createdAt: -1 })
      .populate('owner', '-password -__v')
      .populate('userId')

      .populate('productId')
      .lean();

    // Check if carts array is empty
    if (!carts.length) {
      return res.status(404).json({ message: 'No carts found' });
    }

    // Send carts data in the response
    res.json({ carts, message: 'Carts retrieved successfully' });
  } catch (error) {
    console.error('Error fetching carts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};






const stripe  = new Stripe(process.env.STRIPE_SECRET_KEY)

const checkout = async (req, res) => {
  try {
    const { carts } = req.body;
    if (!carts || !Array.isArray(carts) || carts.length === 0) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // Log and verify image URLs
    carts.forEach(item => {
      console.log(`Product Name: ${item.productId.productName}, Image URL: ${item.productId.imgUrl}`);
    });
    console.log( 'carts',carts)
    const params = {
      submit_type: 'pay',
      mode: "payment",
      payment_method_types: ['card'],
      billing_address_collection: "auto",
      shipping_options: [{ shipping_rate: "shr_1POzAYAUABmyr4e2cQsBJOhp" }],

      metadata: {
        userId: req.userId
      },
      line_items: carts.map((item) => {
        return {
          price_data: {
            currency: "INR",
            product_data: {
              name: item.productId.productName,
              images: item.productId.imgUrl, // Fully qualified URL
              metadata: {
                productId: item.productId._id,
                userId: req.userId
              }
            },
            unit_amount: item.productId.sellingPrice * 100, // Convert to cents
          },
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
          },
          quantity: item.quantity
        };
      }),
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    };

    const session = await stripe.checkout.sessions.create(params);
    res.status(200).json({ sessionId: session.id });
  } catch (err) {
    res.status(err.statusCode || 500).json(err.message);
  }
};


const getAllCartGroupedByUser = async (req, res) => {
  try {
    const carts = await cart.aggregate([
      {
        $lookup: {
          from: "products", // Assuming the collection name is 'products'
          localField: "productId",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      {
        $unwind: "$productId"
      },
      {
        $group: {
          _id: "$userId",
          totalQuantity: { $sum: "$quantity" },
          totalPrice: { $sum: { $multiply: ["$quantity", "$productId.sellingPrice"] } },
          items: { $push: "$$ROOT" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      }
    ]);

    res.json(carts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}





module.exports= {getAllCartGroupedByUser,addtocart, checkout ,deleteCart, getaddtocart,updatecart ,getAllcart,countAddToCartProduct} 