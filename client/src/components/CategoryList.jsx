import { Link } from 'react-router-dom'
import { getproductByCategory } from '../Redux/productSlice'
import { useDispatch,useSelector } from 'react-redux'
import { useEffect } from 'react'

const CategoryList = () => {

    const categoryLoading = new Array(12).fill(null)
    const categoryProduct=useSelector(state => state.productreducer.categoryProduct)
     const loading=useSelector(state => state.productreducer.loading)
    const dispatch=useDispatch()
    useEffect(()=>{
       dispatch(getproductByCategory())
    },[])
  return (
    <div className='container mx-auto p-4'>
           <div className='flex items-center gap-4 justify-between overflow-hidden-scroll scrollbar-none'>
            {

                loading ? (
                    categoryLoading.map((el,index)=>{
                            return(
                                <div className='h-16 w-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-slate-200 animate-pulse' key={"categoryLoading"+index}>
                                </div>
                            )
                    })  
                ) :
                (
                    categoryProduct.map((product,index)=>{
                        return(
                            <Link to={"/product-category?category="+product?.category} className='cursor-pointer' key={product?.category}>
                                <div className='w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-4 bg-slate-200 flex items-center justify-center'>
                                    <img src={product?.imgUrl[0]} alt={product?.category} className='h-full object-scale-down mix-blend-multiply hover:scale-125 transition-all'/>
                                </div>
                                <p className='text-center text-sm md:text-base capitalize'>{product?.category}</p>
                            </Link>
                        )
                    })
                )
            }
           </div>
    </div>
  )
}

export default CategoryList