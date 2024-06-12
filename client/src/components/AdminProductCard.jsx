import  { useState } from 'react'
import { MdModeEditOutline } from "react-icons/md";
import displayINRCurrency from '../helpers/displayCurrency';
import AdminEditProduct from '../pages/AdminEditProduct';
import { useDispatch } from 'react-redux';
import { getproductbyid,deleateproduct } from '../Redux/productSlice';
import { MdDelete } from "react-icons/md";

const AdminProductCard = ({
    data,
}) => {
  const dispatch=useDispatch()
  const [editProduct,setEditProduct] = useState(false)

  return (
    <div className='bg-white p-4 rounded '>
       <div className='w-40'>
            <div className='w-32 h-32 flex justify-center items-center'>
   

            {data.imgUrl && data.imgUrl[0] && (
  <img src={data.imgUrl[0] } className='mx-auto object-fill h-full' alt="Product Image" />
)}

            </div> 
            <h1 className='text-ellipsis line-clamp-2'>{data.brandName}</h1>

            <div>

                <p className='font-semibold'>
                  {
                    displayINRCurrency(data.sellingPrice)
                  }
        
                </p>
                <div className='w-fit ml-auto p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer' 
                onClick={() => {
                    dispatch(getproductbyid(data._id))
                      .then(() => {
                        setEditProduct(true);
                      })
                      .catch((error) => {
                        console.error('Error fetching product:', error);
                      });
                  }}>
     <MdModeEditOutline  /> 
                </div>
                <div className='w-fit ml-auto p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer' 
                onClick={() => {
                    dispatch(getproductbyid(data._id))
                      .then(() => {
                        dispatch(deleateproduct(data._id));
                      })
                      .catch((error) => {
                        console.error('Error fetching product:', error);
                      });
                  }}>
            <MdDelete/>

                </div>
            </div>

          
       </div>
        
     
    
       {
          editProduct && (
          <AdminEditProduct productData={data} onClose={()=>setEditProduct(false) } />
          )
        }
    
    </div>
  )
}






export default AdminProductCard