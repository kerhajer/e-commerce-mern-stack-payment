import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UploadProduct from '../components/UploadProduct'
import AdminProductCard from '../components/AdminProductCard'
import { getProduct } from '../Redux/productSlice'
const AllProducts = () => {

   const products=useSelector(state => state.productreducer.products)
  const [openUploadProduct,setOpenUploadProduct] = useState(false)

  const dispatch=useDispatch()
  useEffect(()=>{
     dispatch(getProduct())
  },[])
  
  return (
    <div>
        <div className='bg-white py-2 px-4 flex justify-between items-center'>
            <h2 className='font-bold text-lg'>All Product</h2>
            <button  className='border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full ' onClick={()=>setOpenUploadProduct(true)}>Upload Product</button>
        </div>

        {/**all product */}
        <div className='flex items-center flex-wrap gap-5 py-4 h-[calc(100vh-190px)] overflow-y-scroll'>
          {
            products.map((product,index)=>{
              return(
                <AdminProductCard data={product} key={index+"allProduct"} />
                
              )
            })
          }
        </div>





        {
          openUploadProduct && (
            <UploadProduct onClose={()=>setOpenUploadProduct(false)} />
          )
        }
      

    </div>
  )
}

export default AllProducts