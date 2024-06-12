import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct';
import { useDispatch, useSelector } from 'react-redux';
import { getproductwisebycategory } from '../Redux/productSlice';
import { useEffect } from 'react';
export default function Home() {

  const dispatch = useDispatch();
  const loading = useSelector(state => state.productreducer.loading);
  const   filtredproduct = useSelector(state => state.productreducer.filtredproduct)  
  console.log('filtredproduct' ,filtredproduct);

  const categories = [
    "airdopes", "camera", "earphones", "mobile", "mouse", "printers",
    "processor", "refrigerator", "speakers", "trimmers", "TV", "watch"
  ];


  useEffect(() => {
    // Dispatch the action to fetch product data when the component mounts
    dispatch(getproductwisebycategory({ categories }));

    // Add dependencies to control when the effect should re-run
  }, []);







  return (
    <div>
      <CategoryList/>
      <BannerProduct/>
      
      <HorizontalCardProduct 
        category={"airdopes"} 
        heading={"Top's Airpodes"}
        filtredproduct={filtredproduct}
        loading={loading}
      />
      <HorizontalCardProduct 
        category={"watch"} 
        heading={"Popular's Watches"}
        filtredproduct={filtredproduct}
        loading={loading}
      />
      <VerticalCardProduct category={"mobile"} heading={"Mobiles"}
          filtredproduct={filtredproduct}
          loading={loading}/>
       <VerticalCardProduct category={"mouse"} heading={"Mouse"}
           filtredproduct={filtredproduct}
           loading={loading}/>
       <VerticalCardProduct category={"TV"} heading={"Televisions"} 
           filtredproduct={filtredproduct}
           loading={loading}/>
       <VerticalCardProduct category={"earphones"} heading={"Wired Earphones"}
           filtredproduct={filtredproduct}
           loading={loading}/>
      <VerticalCardProduct category={"speakers"} heading={"speakers"}
          filtredproduct={filtredproduct}
          loading={loading}/>
      <VerticalCardProduct category={"refrigerator"} heading={"Refrigerator"}
          filtredproduct={filtredproduct}
          loading={loading}/>
      <VerticalCardProduct category={"trimmers"} heading={"Trimmers"}     filtredproduct={filtredproduct}
        loading={loading}/>
    </div>
  )
}
