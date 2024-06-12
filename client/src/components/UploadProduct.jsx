import { useState, useEffect } from 'react'
import { CgClose } from "react-icons/cg";
import { FaCloudUploadAlt } from "react-icons/fa";
import { addProduct, getProduct } from '../Redux/productSlice';
import { useDispatch, useSelector } from 'react-redux'
import { MdDelete } from "react-icons/md";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useNavigate } from 'react-router-dom';

const UploadProduct = ({ onClose }) => {
  const products = useSelector(state => state.productreducer.products)
  const msg = useSelector(state => state.productreducer.msg)
  const [showAlert, setShowAlert] = useState(false);

  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getProduct())
  }, [])

  const [openFullScreenImage, setOpenFullScreenImage] = useState(false)
  const [fullScreenImage, setFullScreenImage] = useState("")

  const [imgFiles, setImgFiles] = useState([]);
  const [imgUrls, setImgUrls] = useState([]);
  const [video, setVideo] = useState(undefined);
  const [imgPerc, setImgPerc] = useState([]);
  const [videoPerc, setVideoPerc] = useState(0);
  const [inputs, setInputs] = useState({});

  const handleChange = (e) => {
    const { name, files } = e.target;
    if (files) {
      if (name === 'imgUrl') {
        const newFiles = Array.from(files);
        setImgFiles((prevFiles) => [...prevFiles, ...newFiles]);
        setImgUrls((prevUrls) => [...prevUrls, ...newFiles.map(file => URL.createObjectURL(file))]);
      } else if (name === 'videoUrl') {
        setVideo(files[0]);
      }
    } else {
      setInputs((prev) => ({
        ...prev,
        [name]: e.target.value,
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
          });
        }
      );
    });
  };

  useEffect(() => {
    if (video) {
      uploadFile(video, "videoUrl").then((downloadURL) => {
        setInputs((prev) => ({
          ...prev,
          videoUrl: downloadURL,
        }));
      });
    }
  }, [video]);

  useEffect(() => {
    const uploadImages = async () => {
      const uploadedUrls = await Promise.all(imgFiles.map(file => uploadFile(file, "imgUrl")));
      setInputs((prev) => ({
        ...prev,
        imgUrl: uploadedUrls,
      }));
    };

    if (imgFiles.length > 0) {
      uploadImages();
    }
  }, [imgFiles]);

  const handleUpload = async (e) => {
    e.preventDefault();
    dispatch(addProduct({inputs}))
      .then(() => {
        setShowAlert(true);
        setTimeout(() => {
          onClose();
        }, 3000);
        dispatch(getProduct());
      })
      .catch((error) => {
        console.error('Error adding product:', error);
      });
  };

  const handleDeleteProductImage = (urlToDelete) => {
    const newImgUrls = imgUrls.filter(url => url !== urlToDelete);
    setImgUrls(newImgUrls);
    setImgFiles(imgFiles.filter((file, index) => URL.createObjectURL(file) !== urlToDelete));
  };

  return (
    <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
      <div className='bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>
        <div className='flex justify-between items-center pb-3'>
          <h2 className='font-bold text-lg'>Upload Product</h2>
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
        <form className='grid p-4 gap-2 overflow-y-scroll h-full pb-5' onSubmit={handleUpload}>
          <label htmlFor='productImage' className='mt-3'>Product Image :</label>
          <label htmlFor='uploadImageInput'>
            <div className='p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer relative'>
              <div className="relative group">
                {imgUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className='w-20 h-20 flex justify-center items-center'>
                      <img
                        src={url}
                        alt="Product Image"
                        width={80}
                        height={80}
                        className='bg-slate-100 border cursor-pointer'
                        onClick={() => {
                          setOpenFullScreenImage(true)
                          setFullScreenImage(url)
                        }}
                      />
                    </div>
                    <div className='absolute bottom-0 right-0 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer' onClick={() => handleDeleteProductImage(url)}>
                      <MdDelete />
                    </div>
                  </div>
                ))}
              </div>
              <div className='text-slate-500 flex justify-center items-center flex-col gap-2'>
                <span className='text-4xl'><FaCloudUploadAlt /></span>
                <input type='file' name='imgUrl' id='uploadImageInput' className='hidden' onChange={handleChange} multiple />
              </div>
            </div>
          </label>
          {imgPerc.some(perc => perc > 0 && perc < 100) && (
            <p className='text-red-600 text-xs mt-2'>*Uploading images...</p>
          )}
          <label htmlFor='productName'>Product Name :</label>
          <input
            type='text'
            id='productName'
            placeholder='enter product name'
            name='productName'
            onChange={handleChange}
            className='p-2 bg-slate-100 border rounded'
            required
          />
          <label htmlFor='brandName' className='mt-3'>Brand Name :</label>
          <input
            type='text'
            id='brandName'
            placeholder='enter brand name'
            name='brandName'
            className='p-2 bg-slate-100 border rounded'
            required
            onChange={handleChange}
          />
          <label htmlFor='category' className='mt-3'>Category :</label>
          <select
            name='category'
            className='p-2 bg-slate-100 border rounded'
            onChange={handleChange}
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
            onChange={handleChange}
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
                <input type='file' name='videoUrl' id='uploadVideoInput' className='hidden' onChange={(e) => setVideo(e.target.files[0])} />
              </div>
            </div>
          </label>
          {videoPerc === 0 && (
            <p className='text-red-600 text-xs mt-2'>*Please upload a video product</p>
          )}
          <label htmlFor='price' className='mt-3'>Price :</label>
          <input
            type='number'
            id='price'
            placeholder='enter price'
            onChange={handleChange}
            name='price'
            className='p-2 bg-slate-100 border rounded'
            required
          />
          <label htmlFor='sellingPrice' className='mt-3'>Selling Price :</label>
          <input
            type='number'
            id='sellingPrice'
            placeholder='enter selling price'
            name='sellingPrice'
            className='p-2 bg-slate-100 border rounded'
            required
            onChange={handleChange}
          />
          <label htmlFor='description' className='mt-3'>Description :</label>
          <textarea
            className='h-28 bg-slate-100 border resize-none p-1'
            placeholder='enter product description'
            rows={3}
            name='description'
            onChange={handleChange}
          />
          <button className='px-3 py-2 bg-red-600 text-white mb-10 hover:bg-red-700' type='submit'>Upload Product</button>
        </form>
      </div>
      {
        openFullScreenImage && (
          <DisplayImage onClose={() => setOpenFullScreenImage(false)} imgUrl={fullScreenImage} />
        )
      }
    </div>
  )
}

export default UploadProduct;