import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signingUp } from '../Redux/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import loginIcons from '../assets/signin.gif';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import check from "../assets/check.gif"
export default function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [newUser, setNewUser] = useState({});
  const msg = useSelector(state => state.AuthReducer.msg);
  const user = useSelector(state => state.AuthReducer.user);
  const [showAlert, setShowAlert] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [image, setImage] = useState(loginIcons);

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const [imageURL, setImageURL] = useState("");
  const [progress, setProgress] = useState(0);

  const handleUploadPic = (e) => {
    if (e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setImage(URL.createObjectURL(selectedImage));

      const storage = getStorage();
      const fileName = new Date().getTime() + selectedImage.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, selectedImage);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.error("Upload error:", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageURL(downloadURL);
            setNewUser(prev => ({ ...prev, image: downloadURL }));
            console.log("File available at", downloadURL);
          });
        }
      );
    }
  };

  const registering = async (e) => {
    e.preventDefault();
    await dispatch(signingUp(newUser)).then(() => {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        navigate('/login');
      }, 3000);
    });
  };


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4' onSubmit={registering}>
        <div className='w-20 h-20 mx-auto relative overflow-hidden rounded-full'>
          <img src={imageURL || image} alt='login icons' className='w-full h-full object-cover' />
          <label>
            <div className='text-xs bg-opacity-80 bg-slate-200 pb-4 pt-2 cursor-pointer text-center absolute bottom-0 w-full'>
              Upload Photo
            </div>
            <input type='file' className='hidden' onChange={handleUploadPic} />
          </label>
          {progress > 0 && progress < 100 && (
            <div className='text-center text-sm mt-2'>{`Upload is ${progress}% done`}</div>
          )}
        </div>
        <input
          type='text'
          placeholder='username'
          className='border p-3 rounded-lg bg-white'
          id='name'
          name='name'
          onChange={handleChange}
        />
        <input
          type='email'
          placeholder='email'
          className='border p-3 rounded-lg bg-white'
          id='email'
          name='email'
          onChange={handleChange}
        />
        <div className='bg-white border p-3 rounded-lg flex items-center'>
          <input
            type={showPassword ? "text" : "password"}
            placeholder='password'
            className='w-full h-full outline-none bg-transparent'
            id='password'
            name='password'
            onChange={handleChange}
          />
          <div className='cursor-pointer text-xl' onClick={() => setShowPassword(prev => !prev)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>
        <div className='bg-white border p-3 rounded-lg flex items-center'>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder='enter confirm password'
            name='confirmPassword'
            onChange={handleChange}
            required
            className='w-full h-full outline-none bg-transparent'
          />
          <div className='cursor-pointer text-xl' onClick={() => setShowConfirmPassword(prev => !prev)}>
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>
        <button
          type='submit'
          className='bg-slate-700 hover:bg-slate-700 text-white px-6 py-2 w-full max-w-[600px] rounded-full hover:scale-110 transition-all mx-auto block mt-6'
        >
          Sign Up
        </button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={'/login'}>
          <span className='text-red-600'>Sign in</span>
        </Link>
      </div>
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
    </div>
  );
}