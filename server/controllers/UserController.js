const User = require('../models/Userschema')
const { validationResult } =  require('express-validator')
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
require('dotenv').config()
const uploadProductPermission = require("../Middlewares/Permisson")

const product =require ("../models/productschema");


const Register = async(req,res)=>{
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(402).json({errors:errors.mapped() })
        }
        
    
        const {name,email,password,address,phonenumber,image, Role} = req.body
        
  

        // verify if the user exists 
        const isfound = await User.findOne({email})
        if(isfound){
           return res.status(401).json({message:'You have already registered!'})
        }
        // hashing of the password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //save the user in the DB
        const newUser =  await User.create({name,email,password:hashedPassword,address,phonenumber,image, Role})
        res.status(201).json({newUser,msg:'User has been created successfully'})
    
    } catch (error) {
        res.status(501).json({message:error})
    }
}
const Login = async(req,res)=>{
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(402).json({errors:errors.mapped() })
        }
        const {email, password} = req.body
        // vérifier si l'utilisateur n'a pas du compte!!
        const isfound = await User.findOne({email})
        if(!isfound){
            return res.status(403).json({msg:'You have to register before !!'})
        }
        // compare the password (req.body) vs password from the DB
        const isMatch = bcrypt.compareSync(password, isfound.password)
        if(!isMatch){
            return res.status(402).json({msg:'Wrong password'})
        }
        //generate a token
        const token = await jwt.sign({id:isfound._id},process.env.SECRET)
        
        res.status(200).json({token,isfound,msg:'User has been connected successfully'})
    } catch (error) {
        res.status(501).json({msg:error})
    }

}

 




const updateprofile=async (req, res) => {

 
    try {
      //1 find() //2 Edit() // 3 save()
      //findByIdAndUpdte 
      const updatedUser  = await User.findByIdAndUpdate(req.params.id,req.body,{new:true})
      res.json({msg:'user has been updated successfully!',updatedUser })

  } catch (error) {
      console.log(error);
  }
}













    const getAllusers = async(req,res)=>{
      try {
          const users = await User.find({})
          res.json(users)
      } catch (error) {
          res.status(501).json({message: error })
      }
  }












    const googleAuth = async (req, res, next) => {
      try {
        const isfound= await User.findOne({ email: req.body.email });
        if (isfound) {
          const token = jwt.sign({ id: isfound._id }, process.env.SECRET);
          res
            .cookie("access_token", token, {
              httpOnly: true,
            })
            .status(200)
            .json({token,isfound,msg:'User has been connected successfully'})
        } else {
          const newUser = new User({
            ...req.body,
            fromGoogle: true,
          });
          const isfound = await newUser.save();
          const token = jwt.sign({ id: isfound._id }, process.env.SECRET);
          res
            .cookie("access_token", token, {
              httpOnly: true,
            })
            .status(200)
            . json({token,isfound,msg:'User has been connected successfully'})
    
        }
      } catch (err) {
        next(err);
      } 
    };


    const getuserbyid = async (req, res, next) => {
      try {
          const user = await User.findById(req.params.id)
           
      
          if (!user) {
            return res.status(404).json({ msg: "user not found" });
          }
      
          res.json(user);
        } catch (error) {
          res.status(500).json({ msg: error });
        }
      }
















    

    
      const deleteUser = async (req, res, next) => {
        try {
          // Check if user is authorized to delete (admin or deleting themself)
          const authorized = req.userId === req.params.id || (uploadProductPermission(req.userId) && !uploadProductPermission(req.params.id));
          
          if (!authorized) {
            return res.status(403).json({msg:"You can only delete your account or delete others as admin!"});
          }
      
          // Delete the user
          const deletedUser = await User.findByIdAndDelete(req.params.id);
      
          // Check if user was found and deleted (handle potential errors)
          if (!deletedUser) {
            return res.status(404).json({msg:"User not found or deletion failed"});
          }
      
          res.status(200).json({msg:"User has been deleted."});
        } catch (err) {
          // Handle errors more specifically (same logic as before)
          if (err.name === 'CastError') {
            return res.status(400).json("Invalid user ID format");
          } else {
            next(err);
          }
        }
      };
     
      const like = async (req, res, next) => {
        const userId = req.userId;
        const productId = req.params.productId;
        try {
          const product = await product.findByIdAndUpdate(
            videoId,
            { $addToSet: { likes: userId },
            $pull: { dislikes: userId } 
          },
            { new: true }
          ).populate({
            path: 'likes',
            select: '-password -__v' // Exclude password and __v fields from the user documents
          }).populate({
            path: 'owner',
            select: '-password -__v' // Exclude password and __v fields from the user documents
          })
          res.status(200).json(product);
        } catch (err) {
          next(err);
        }
      };
      const dislike = async (req, res, next) => {
        const userId = req.userId;
        const productId = req.params.videoId;
        try {
          const product = await product.findByIdAndUpdate(
            productId,
            {
              $addToSet: { dislikes: userId }, // Add the user ID to the dislikes array
              $pull: { likes: userId } 
            },
            { new: true }
          ).populate({
            path: 'dislikes',
            select: '-password -__v' // Exclude password and __v fields from the user documents
          }).populate({
            path: 'owner',
            select: '-password -__v' // Exclude password and __v fields from the user documents
          })
          res.status(200).json(product);
        } catch (err) {
          next(err);
        }
      };

      module.exports = {Register,Login ,getAllusers,googleAuth,updateprofile,getuserbyid,deleteUser,like,dislike}