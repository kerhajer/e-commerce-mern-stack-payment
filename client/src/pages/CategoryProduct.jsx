import  { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchbycategory } from '../Redux/productSlice';
import VerticalCard from '../components/VerticalCard';

const CategoryProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const urlSearch = new URLSearchParams(location.search);
  const urlCategoryListinArray = urlSearch.getAll('category');
  const filtredproduct = useSelector((state) => state.productreducer.filtredproduct);
  const loading = useSelector((state) => state.productreducer.loading);

  // Construct an object to represent categories
  const urlCategoryListObject = {};
  urlCategoryListinArray.forEach((category) => {
    urlCategoryListObject[category] = true; // Set category as key with value true
  });
  const [selectCategory, setSelectCategory] = useState(urlCategoryListObject);
  const [sortBy, setSortBy] = useState("");

  const categories = [
    "airdopes", "camera", "earphones", "mobile", "mouse", "printers",
    "processor", "refrigerator", "speakers", "trimmers", "TV", "watch"
  ];

  const handleSelectCategory = (e) => {
    const { value, checked } = e.target;
    setSelectCategory((prev) => ({
      ...prev,
      [value]: checked,
    }));
  };

  useEffect(() => {
    const selectedCategories = Object.keys(selectCategory).filter(key => selectCategory[key]);
    dispatch(searchbycategory({ category: selectedCategories }));
  }, [selectCategory, dispatch]);

  useEffect(() => {
    const selectedCategories = Object.keys(selectCategory).filter(key => selectCategory[key]);
    const urlFormat = selectedCategories.map((category) => `category=${category}`).join('&');
    navigate("/product-category?" + urlFormat);
  }, [selectCategory, navigate]);

  const handleOnChangeSortBy = (e) => {
    const { value } = e.target;
    setSortBy(value);

    const sortedProduct = { ...filtredproduct };
    Object.keys(sortedProduct).forEach(category => {
      sortedProduct[category].sort((a, b) => {
        if (value === 'asc') {
          return a.sellingPrice - b.sellingPrice;
        } else if (value === 'dsc') {
          return b.sellingPrice - a.sellingPrice;
        } else {
          return 0;
        }
      });
    });

    // Update the state or use a dispatcher if needed to update the store
  };

  return (
    <div className='container mx-auto p-4'>
      <div className='hidden lg:grid grid-cols-[200px,1fr]'>
        <div className='bg-white p-2 min-h-[calc(100vh-120px)] overflow-y-scroll'>
          <div>
            <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Sort by</h3>
            <form className='text-sm flex flex-col gap-2 py-2'>
              <div className='flex items-center gap-3'>
                <input type='radio' name='sortBy' checked={sortBy === 'asc'} onChange={handleOnChangeSortBy} value={"asc"} />
                <label>Price - Low to High</label>
              </div>
              <div className='flex items-center gap-3'>
                <input type='radio' name='sortBy' checked={sortBy === 'dsc'} onChange={handleOnChangeSortBy} value={"dsc"} />
                <label>Price - High to Low</label>
              </div>
            </form>
          </div>
          <div>
            <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Category</h3>
            <form className='text-sm flex flex-col gap-2 py-2'>
              {categories.map((categoryName, index) => (
                <div className='flex items-center gap-3' key={index}>
                  <input type='checkbox' name="category" checked={selectCategory[categoryName] || false} value={categoryName} id={categoryName} onChange={handleSelectCategory} />
                  <label htmlFor={categoryName}>{categoryName}</label>
                </div>
              ))}
            </form>
          </div>
        </div>
        <div className='px-4'>
          <p className='font-medium text-slate-800 text-lg my-2'>Search Results: {Object.keys(filtredproduct).reduce((acc, category) => acc + filtredproduct[category].length, 0)}</p>
          <div className='min-h-[calc(100vh-120px)] overflow-y-scroll max-h-[calc(100vh-120px)]'>
            {Object.keys(filtredproduct).map((category) => (
              <div key={category}>
                <h3 className='text-base font-medium'>{category}</h3>
                <VerticalCard data={filtredproduct[category]} loading={loading} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryProduct;