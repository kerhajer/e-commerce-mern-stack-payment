require('dotenv').config()
const jwt = require('jsonwebtoken')

exports.AuthMiddleWare = (req,res,next)=>{
  const token = req.header('token')
  if(!token){
    return res.json({message: 'token must be provided !!'})
  }
  const decoded =  jwt.verify(token, process.env.SECRET);
  if(!decoded){
    return res.json({message:'You are not authorized!!'})
  }
 req.userId = decoded.id
 next()
}