const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const cartSchema =  new mongoose.Schema({

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      productId : {
        ref : 'product',
        type : mongoose.Schema.Types.ObjectId,
        required: true,

   },

   
   quantity : Number,
   userId : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,

  },
},{
    timestamps : true
})



module.exports = mongoose.model("cart",cartSchema)
