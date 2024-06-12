const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const productSchema =  new mongoose.Schema({



    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      userId: {
        type: String,
      },
      productName: {
        type: String,
        required: true,
      },
      
      brandName : {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },

      imgUrl: {
        type: [String], // Déclare un tableau de chaînes de caractères
        required: true
      },
        
      
      videoUrl: {
        type: String,
      },
      description:{
        type: String,
        required: true,
      }, 
      price: {
        type: Number,
        default: 0,
      },
      sellingPrice: {
        type: Number,
        default: 0,
      },
      tags: {
        type: [String],
        default: [],
      },
      likes:
      [{type:ObjectId,ref:"User"}],
      
      dislikes: 
      [{type:ObjectId,ref:"User"}], 
      
    },
    { timestamps: true }
  );














module.exports = mongoose.model("product",productSchema)
