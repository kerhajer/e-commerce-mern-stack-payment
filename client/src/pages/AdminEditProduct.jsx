import { useState, useEffect } from 'react';
import { CgClose } from "react-icons/cg";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { UpdatePRODUCT, getproductbyid } from '../Redux/productSlice';
import { useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { MdDelete } from "react-icons/md";

const AdminEditProduct = ({ onClose, productData }) => {
  const msg = useSelector(state => state.productreducer.msg);
  const products = useSelector(state => state.productreducer.products);
  const currentproduct = useSelector(state => state.productreducer.currentproduct.randomProduct);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [imgUrl, setImgUrl] = useState([]);
  const [video, setVideo] = useState(undefined);
  const [videoPerc, setVideoPerc] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  const [updatedproduct, setUpdatedproduct] = useState({
    _id: (productData && productData._id) || (currentproduct && currentproduct._id),
    productName: (productData && productData.productName) || (currentproduct && currentproduct.productName),
    brandName: (productData && productData.brandName) || (currentproduct && currentproduct.brandName),
    category: (productData && productData.category) || (currentproduct && currentproduct.category),
    imgUrl: (productData && productData.imgUrl) || (currentproduct && currentproduct.imgUrl),
    videoUrl: (productData && productData.videoUrl) || (currentproduct && currentproduct.videoUrl),
    description: (productData && productData.description) || (currentproduct && currentproduct.description),
    price: (productData && productData.price) || (currentproduct && currentproduct.price),
    sellingPrice: (productData && productData.sellingPrice) || (currentproduct && currentproduct.sellingPrice)
  });

  const [imgFiles, setImgFiles] = useState([]);
  const [imgPerc, setImgPerc] = useState([]);

  const handleOnChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      if (name === 'imgUrl') {
        const newFiles = Array.from(files);
        setImgFiles((prevFiles) => [...prevFiles, ...newFiles]);
        setImgUrl((prevUrls) => [...prevUrls, ...newFiles.map(file => URL.createObjectURL(file))]);
      } else if (name === 'videoUrl') {
        setVideo(files[0]);
      }
    } else {
      setUpdatedproduct((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const uploadFile = (file, urlType) => {
    const storage = getStorage();
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (urlType === "imgUrl") {
            setImgPerc((prevPerc) => [...prevPerc, Math.round(progress)]);
          } else {
            setVideoPerc(Math.round(progress));
          }
        },
        (error) => {
          alert('Error uploading file: ' + error.message);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
            setUpdatedproduct((prev) => ({
              ...prev,
              [urlType]: [...prev[urlType], downloadURL]
            }));
          });
        }
      );
    });
  };

  useEffect(() => {
    if (video) {
      uploadFile(video, "videoUrl");
    }
  }, [video]);

  useEffect(() => {
    const uploadImages = async () => {
      await Promise.all(imgFiles.map(file => uploadFile(file, "imgUrl")));
    };

    if (imgFiles.length > 0) {
      uploadImages();
    }
  }, [imgFiles]);

  const handleDeleteProductImage = async (urlToDelete) => {
    const storage = getStorage();
    const fileRef = ref(storage, urlToDelete);

    try {
      await deleteObject(fileRef);

      const newImgUrls = updatedproduct.imgUrl.filter(url => url !== urlToDelete);
      setImgUrl(newImgUrls);
      setImgFiles(imgFiles.filter((file) => URL.createObjectURL(file) !== urlToDelete));
      setUpdatedproduct((prevState) => ({
        ...prevState,
        imgUrl: newImgUrls
      }));
    } catch (error) {
      console.error("Error deleting image from Firebase Storage:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await dispatch(getproductbyid(productData._id || currentproduct._id));
      navigate(`/admin-panel/random/${productData._id || currentproduct._id}`);

      const uniqueImgUrls = Array.from(new Set([...updatedproduct.imgUrl]));

      await dispatch(UpdatePRODUCT({
        ...updatedproduct,
        imgUrl: uniqueImgUrls
      })).then(() => {
        setShowAlert(true);
        setTimeout(() => {
          onClose();
        }, 3000);
        navigate('/admin-panel/random');
      });

      console.log("Updated Product Data:", updatedproduct);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
      <div className='bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>
        <div className='flex justify-between items-center pb-3'>
          <h2 className='font-bold text-lg'>Edit Product</h2>
          <div className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
            <CgClose />
          </div>
        </div>
        {showAlert && (
          <div className='bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4' role='alert'>
            <p className='font-bold'>Info</p>
            <p>{msg}</p>
          </div>
        )}
        <form className='grid p-4 gap-2 overflow-y-scroll h-full pb-5'>
          <label htmlFor='productImage' className='mt-3'>Product Image :</label>
          <label htmlFor='uploadImageInput'>
            <div className='flex justify-center items-center'>
              {updatedproduct.imgUrl?.map((url, index) => (
                <div key={index} className="relative group mr-2">
                  <div className='w-23 h-23 flex justify-center items-center'>
                    <img
                      src={url}
                      alt="Product Image"
                      className='mx-auto object-fill h-full'
                    />
                  </div>
                  <div className='absolute bottom-0 right-0 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer' onClick={() => handleDeleteProductImage(url)}>
                    <MdDelete />
                  </div>
                </div>
              ))}
            </div>
            <div className='text-slate-500 flex justify-center items-center flex-col gap-2'>
              <span style={{ width: '10px', height: '10px' }} className='text-4xl'><FaCloudUploadAlt /></span>
              <input type='file' name='imgUrl' id='uploadImageInput' className='hidden' onChange={handleOnChange} />
            </div>
          </label>
          {!imgUrl.length > 0 && (
            <p className='text-red-600 text-xs mt-2'>*Please change at least one image for the product</p>
          )}





          <label htmlFor='productName'>Product Name :</label>
          <input
            type='text'
            id='productName'
            placeholder='enter product name'
            name='productName'
            defaultValue={updatedproduct.productName}
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
          />


          <label htmlFor='brandName' className='mt-3'>Brand Name :</label>
          <input
            type='text'
            id='brandName'
            placeholder='enter brand name'
            defaultValue={updatedproduct.brandName}
            name='brandName'
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
          />

          <label htmlFor='category' className='mt-3'>Category :</label>

          <select
  name='category'
  className='p-2 bg-slate-100 border rounded'
  onChange={handleOnChange}
>
  <option value={""}>Select Category</option>
  {products.reduce((uniqueCategories, el) => {
    if (!uniqueCategories.includes(el.category)) {
      uniqueCategories.push(el.category);
    }
    return uniqueCategories;
  }, []).map((category, index) => (
    <option value={category} key={category + index}>{category}</option>
  ))}
</select>

          <input
            type='text'
            id='category'
            placeholder='Enter new category'
            name='category'
            defaultValue={updatedproduct.category}
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
          />



          <label htmlFor='productVideo' className='mt-3'>Video :</label>
          <label htmlFor='uploadVideoInput'>
            <div className='p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer relative'>
              {videoPerc > 0 && (
                <video
                  src={URL.createObjectURL(video)}
                  alt="Product Video"
                  width={50}
                  height={50}
                  className='absolute inset-0 object-cover z-10'
                />
              )}
              <div className='text-slate-500 flex justify-center items-center flex-col gap-2'>
                <span className='text-4xl'><FaCloudUploadAlt /></span>
                <p className='text-sm'>Upload Product Video</p>
                <input type='file' defaultValue={updatedproduct.videoUrl} name='videoUrl' id='uploadVideoInput' className='hidden' onChange={handleOnChange} />
              </div>
            </div>
          </label>
          {!videoPerc > 0 && (
            <p className='text-red-600 text-xs mt-2'>*Please upload a video product</p>
          )}



          <label htmlFor='price' className='mt-3'>Price :</label>
          <input
            type='number'
            id='price'
            placeholder='enter price'
            defaultValue={updatedproduct.price}
            name='price'
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
          />


          <label htmlFor='sellingPrice' className='mt-3'>Selling Price :</label>
          <input
            type='number'
            id='sellingPrice'
            placeholder='enter selling price'
            defaultValue={updatedproduct.sellingPrice}
            name='sellingPrice'
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
          />

          <label htmlFor='description' className='mt-3'>Description :</label>
          <textarea
            className='h-28 bg-slate-100 border resize-none p-1'
            placeholder='enter product description'
            rows={3}
            onChange={handleOnChange}
            name='description'
            defaultValue={updatedproduct.description}
          >
          </textarea>





        <button className='px-3 py-2 bg-red-600 text-white mb-10 hover:bg-red-700' onClick={handleUpdate}>Update Product</button>
        </form>




      </div>


    </div>
  )
}

export default AdminEditProduct