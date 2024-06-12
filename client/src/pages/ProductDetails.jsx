import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaStar, FaStarHalf } from "react-icons/fa";
import displayINRCurrency from '../helpers/displayCurrency';
import { getproductbyid } from '../Redux/productSlice';
import { useSelector, useDispatch } from 'react-redux';
import CategroyWiseProductDisplay from '../components/CategroyWiseProductDisplay';
import { addcart } from '../Redux/cartSlice';
import check from "../assets/check.gif"

const ProductDetails = () => {
  const user = useSelector(state => state.AuthReducer.user)
  const userId=user._id
  const currentproduct = useSelector(state => state.productreducer.currentproduct);
  const loading = useSelector(state => state.productreducer.loading);
  const dispatch = useDispatch();
  const msg = useSelector(state => state.cartreducer.msg);
  const [showAlert, setShowAlert] = useState(false);
  const params = useParams();
  const productImageListLoading = new Array(4).fill(null);
  const [activeImage, setActiveImage] = useState("");
  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({ x: 0, y: 0 });
  const [zoomImage, setZoomImage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (params.id) {
      dispatch(getproductbyid(params.id));
    }
  }, [dispatch, params.id]);

  const handleMouseEnterProduct = (imageURL) => {
    setActiveImage(imageURL);
  };
  


  const handleZoomImage = useCallback((e) => {
    setZoomImage(true);
    const { left, top, width, height } = e.target.getBoundingClientRect();

    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    setZoomImageCoordinate({ x, y });
  }, []);

  const handleLeaveImageZoom = () => {
    setZoomImage(false);
  };

  const handleAddToCart = async () => {
    await dispatch(addcart({ productId: params.id }));
    if (msg) {
      console.log("Displaying alert...");
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
        console.log("Alert hidden, navigating to /cart...");
        navigate("/cart");
      }, 2000);
      
      return () => clearTimeout(timer); // Cleanup timer
    }
  };
  
  const handleBuyProduct = async () => {
    await dispatch(addcart({ productId: params.id }));
    if (msg) {
      console.log("Displaying alert...");
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
        console.log("Alert hidden, navigating to /cart...");
        navigate("/cart");
      }, 2000);
      
      return () => clearTimeout(timer); // Cleanup timer
    }
  };

  return (
    <div className='container mx-auto p-4'>
        {showAlert && (
        <div className='bg-orange-100 border-l-4 border-orange-500 text-red-600 p-4' role='alert'>
           <img 
        src={check} 
        alt='Success Icon' 
        className='w-10 h-10'
      />
          <p>{msg}</p>
        </div>
      )}
      <div className='min-h-[200px] flex flex-col lg:flex-row gap-4'>
        {/***product Image */}
        <div className='h-96 flex flex-col lg:flex-row-reverse gap-4'>
          <div className='h-[300px] w-[300px] lg:h-96 lg:w-96 bg-slate-200 relative p-2'>
            <img
              src={activeImage || (currentproduct?.imgUrl && currentproduct.imgUrl[0])}
              className='h-full w-full object-scale-down mix-blend-multiply'
              onMouseMove={handleZoomImage}
              onMouseLeave={handleLeaveImageZoom}
              alt="Product"
            />
            {/**product zoom */}
            {zoomImage && (
              <div className='hidden lg:block absolute min-w-[500px] overflow-hidden min-h-[400px] bg-slate-200 p-1 -right-[510px] top-0'>
                <div
                  className='w-full h-full min-h-[400px] min-w-[500px] mix-blend-multiply scale-150'
                  style={{
                    background: `url(${activeImage || currentproduct.imgUrl[0]})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: `${zoomImageCoordinate.x * 100}% ${zoomImageCoordinate.y * 100}%`
                  }}
                >
                </div>
              </div>
            )}
          </div>

          <div className='h-full'>
            {loading ? (
              <div className='flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                {productImageListLoading.map((el, index) => (
                  <div className='h-20 w-20 bg-slate-200 rounded animate-pulse' key={"loadingImage" + index}></div>
                ))}
              </div>
            ) : (
              <div className='flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                {currentproduct?.imgUrl?.map((imgURL, index) => (
                  <div className='h-20 w-20 bg-slate-200 rounded p-1' key={imgURL}>
                    <img
                      src={imgURL}
                      className='w-full h-full object-scale-down mix-blend-multiply cursor-pointer'
                      onMouseEnter={() => handleMouseEnterProduct(imgURL)}
                      onClick={() => handleMouseEnterProduct(imgURL)}
                      alt="Product Thumbnail"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/***product details */}
        {loading ? (
          <div className='grid gap-1 w-full'>
            <p className='bg-slate-200 animate-pulse h-6 lg:h-8 w-full rounded-full inline-block'></p>
            <h2 className='text-2xl lg:text-4xl font-medium h-6 lg:h-8 bg-slate-200 animate-pulse w-full'></h2>
            <p className='capitalize text-slate-400 bg-slate-200 min-w-[100px] animate-pulse h-6 lg:h-8 w-full'></p>
            <div className='text-red-600 bg-slate-200 h-6 lg:h-8 animate-pulse flex items-center gap-1 w-full'></div>
            <div className='flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1 h-6 lg:h-8 animate-pulse w-full'>
              <p className='text-red-600 bg-slate-200 w-full'></p>
              <p className='text-slate-400 line-through bg-slate-200 w-full'></p>
            </div>
            <div className='flex items-center gap-3 my-2 w-full'>
              <button className='h-6 lg:h-8 bg-slate-200 rounded animate-pulse w-full'></button>
              <button className='h-6 lg:h-8 bg-slate-200 rounded animate-pulse w-full'></button>
            </div>
            <div className='w-full'>
              <p className='text-slate-600 font-medium my-1 h-6 lg:h-8 bg-slate-200 rounded animate-pulse w-full'></p>
              <p className='bg-slate-200 rounded animate-pulse h-10 lg:h-12 w-full'></p>
            </div>
          </div>
        ) : (
          <div className='flex flex-col gap-1'>
            <p className='bg-red-200 text-red-600 px-2 rounded-full inline-block w-fit'>{currentproduct?.brandName}</p>
            <h2 className='text-2xl lg:text-4xl font-medium'>{currentproduct?.productName}</h2>
            <p className='capitalize text-slate-400'>{currentproduct?.category}</p>
            <div className='text-red-600 flex items-center gap-1'>
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStarHalf />
            </div>
            <div className='flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1'>
              <p className='text-red-600'>{displayINRCurrency(currentproduct.sellingPrice)}</p>
              <p className='text-slate-400 line-through'>{displayINRCurrency(currentproduct.price)}</p>
            </div>
            <div className='flex items-center gap-3 my-2'>
              <button
               onClick={handleBuyProduct}
                className='border-2 border-red-600 rounded px-3 py-1 min-w-[120px] text-red-600 font-medium hover:bg-red-600 hover:text-white'
              >
                Buy
              </button>
              <button
              onClick={handleAddToCart}
                className='border-2 border-red-600 rounded px-3 py-1 min-w-[120px] font-medium text-white bg-red-600 hover:text-red-600 hover:bg-white'
              >
                Add To Cart
              </button>
            </div>
            <div>
              <p className='text-slate-600 font-medium my-1'>Description :</p>
              <p>{currentproduct?.description}</p>
            </div>
          </div>
        )}
      </div>

      {currentproduct?.category && (
        <CategroyWiseProductDisplay category={currentproduct?.category} heading={"Recommended Product"} />
      )}
    </div>
  );
};

export default ProductDetails;