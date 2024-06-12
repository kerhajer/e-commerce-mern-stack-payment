import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithGoogle, signingIn } from '../Redux/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import signin from '../assets/signin.gif';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import check from "../assets/check.gif"

const SignIn = () => {
  const navigate = useNavigate();
  const currentUser = useSelector(state => state.AuthReducer.currentUser);
  const msg = useSelector(state => state.AuthReducer.msg);
  const dispatch = useDispatch();
   const loginErrors=useSelector(state => state.AuthReducer.loginErrors);
  const [user, setUser] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const logIn = async (e) => {
    e.preventDefault();
    dispatch(signingIn(user))
      .then(() => {
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          navigate('/'); // Move navigation inside the timeout to ensure message visibility
        }, 3000);
      })
      .catch((error) => {
        // Handle any errors here
        console.error('Authentication error:', error);
      });
  };

  const signInGoogle = async (e) => {
    e.preventDefault();
    dispatch(signInWithGoogle(user))
      .then(() => {
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          navigate('/'); // Move navigation inside the timeout to ensure message visibility
        }, 500);
      })
      .catch((error) => {
        // Handle any errors here
        console.error('Authentication error:', error);
      });
  };

  useEffect(() => {
    if (msg) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return () => clearTimeout(timer); // Clear timeout if component unmounts
    }
  }, [msg]);

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form className='flex flex-col gap-4'>
        <div className='w-20 h-20 mx-auto'>
          <img src={signin} alt='login icons' />
        </div>
        <input
          type='email'
          placeholder='email'
          className='border p-3 rounded-lg bg-white'
          id='email'
          name="email"
          onChange={handleChange}
        />
        <div className='flex items-center border p-3 rounded-lg bg-white'>
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
        <Link to={'/forgot-password'}   >
        <span className='text-red-600'>    Forgot password ?</span>
             
                            </Link>

        <button
          className='bg-slate-700 hover:bg-slate-700 text-white px-6 py-2 w-full max-w-[600px] rounded-full hover:scale-110 transition-all mx-auto block mt-6'
          onClick={logIn}
        >
          Sign In
        </button>
        <button
        className='bg-slate-700 hover:bg-slate-700 text-white px-6 py-2 w-full max-w-[600px] rounded-full hover:scale-110 transition-all mx-auto block mt-6'

          onClick={signInGoogle}
        >
          Sign In with Google
        </button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Don't have an account?</p>
        <Link to={'/register'}>
          <span className='text-red-600'>Sign up</span>
        </Link>
      </div>
      {showAlert && (
        <div className='bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4' role='alert'>
          <img 
        src={check} 
        alt='Success Icon' 
        className='w-10 h-10'
      />
          <p>{msg}  {loginErrors}  </p>
        </div>
      )}
    </div>
  );
};

export default SignIn;