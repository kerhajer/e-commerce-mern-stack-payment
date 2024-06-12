
const express=require('express')
const {getorder,getAllorder} = require('../controllers/orderController.js');
const {AuthMiddleWare} =require ("../Middlewares/AuthMiddleWare.js");

const router = express.Router();


router.get('/order',AuthMiddleWare, getorder)
router.get('/admin-panel/allorder',AuthMiddleWare, getAllorder)

module.exports=router
