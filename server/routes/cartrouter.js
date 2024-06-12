const express=require('express')

const {AuthMiddleWare} =require ("../Middlewares/AuthMiddleWare.js");
const { getAllCartGroupedByUser,checkout,addtocart, deleteCart, getAllcart,updatecart, getaddtocart ,countAddToCartProduct} = require('../controllers/CartController.js');
const router = express.Router();

router.post("/product/:id", AuthMiddleWare,addtocart)
router.post("/", AuthMiddleWare, addtocart)

router.delete("/cart/:id", AuthMiddleWare, deleteCart)
router.put("/cart/:id", AuthMiddleWare, updatecart)
router.get("/countAddToCartProduct",AuthMiddleWare,countAddToCartProduct)

router.get('/cart',AuthMiddleWare,getaddtocart)
router.post('/cart', AuthMiddleWare,checkout )

router.get('/regroup',AuthMiddleWare,getAllCartGroupedByUser)
module.exports=router

