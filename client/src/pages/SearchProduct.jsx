import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import VerticalCard from '../components/VerticalCard'
import { useDispatch ,useSelector} from 'react-redux'
import { searchQ } from '../Redux/productSlice'

const SearchProduct = () => {
    const dispatch=useDispatch()
    const loading=useSelector(state => state.productreducer.loading)
    const products= useSelector((state) => state.productreducer.products)

    const location = useLocation();


    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q') || '';
    console.log("query",query)

    useEffect(() => {
      if (query) {
        dispatch(searchQ(query));
      }
    }, [dispatch, query]);
  

  return (
    <div className='container mx-auto p-4'>
      {
        loading && (
          <p className='text-lg text-center'>Loading ...</p>
        )
      }
 
      <p className='text-lg font-semibold my-3'>Search Results : {products.length}</p>

      {
        products.length === 0 && !loading && (
           <p className='bg-white text-lg text-center p-4'>No Data Found....</p>
        )
      }


      {
        products.length !==0 && !loading && (

          <VerticalCard loading={loading} data={products}/>

        )
      }

    </div>
  )
}

export default SearchProduct