const express=require("express");
const { AuthMiddleWare } =require("../Middlewares/AuthMiddleWare");
const {filterProductController,getCategoryWiseProduct, addProduct,updateproduct, Deleteproduct, getproductbyid, searchProduct, getAllproduct, getCategoryProduct } = require("../controllers/ProductController");




const router = express.Router();

router.post("/admin-panel/random", AuthMiddleWare, addProduct)
router.put('/admin-panel/random/:id',AuthMiddleWare, updateproduct);

router.delete("/admin-panel/random/:id", AuthMiddleWare,Deleteproduct )
router.get("/admin-panel/random/:id",AuthMiddleWare,getproductbyid)
router.get("/product/:id",AuthMiddleWare,getproductbyid)

router.get("/",getCategoryProduct)
router.post("/",getCategoryWiseProduct)

router.get("/admin-panel/random", getAllproduct)
router.get("/search", searchProduct )
router.post("/product-category",filterProductController)
module.exports=router