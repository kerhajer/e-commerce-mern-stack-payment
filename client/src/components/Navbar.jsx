import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { FaSearch } from 'react-icons/fa';
import { logout } from '../Redux/userSlice';
import { useState } from 'react';
import {addcartview} from '../Redux/cartSlice'
import bb from "../assets/bb.gif"

const Navbar = () => {
  const currentUser = useSelector(state => state.AuthReducer.currentUser) 
  const [menuDisplay,setMenuDisplay] = useState(false)
  const URLSearch = new URLSearchParams(location.search);
  const initialQuery = URLSearch.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const carts = useSelector(state => state.cartreducer.carts)||{}

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);


  const dispatch = useDispatch()
  const navigate=useNavigate()
  const handleLogout = async() => {
    dispatch(logout());
    navigate('/register');
    }

    useEffect(()=>{
      dispatch(addcartview())
  },[dispatch])

    const handleSearch = (e)=>{
      const { value } = e.target
      setQuery(value)
  
      if (value) {
        navigate(`/search?q=${value}`); // Encode the value before navigating
      } else {
        navigate('/');
      }
    };

    const handleSearchSubmit = (e) => {
      e.preventDefault();
      if (query) {
        navigate(`/search?q=${query}`);
      } else {
        navigate('/');
      }
    };



return (
    <header className='bg-slate-200 shadow-md'>
    <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
      <Link to='/'>
      
      <h1 className='font-bold text-sm sm:text-xl flex items-center'>
      <img 
        src={bb} 
        alt='Success Icon' 
        className='w-10 h-10 rounded-full mr-2'
      />
      <span className='text-slate-500'>H</span>
      <span className='text-slate-700'>Shop</span>
    </h1>
      </Link>
      <form
       onSubmit={handleSearchSubmit}
        className='bg-slate-100 p-3 rounded-lg flex items-center'
      >

        <input
          type='text'
          placeholder='Search...'
          className='bg-transparent focus:outline-none w-24 sm:w-64'
          onChange={handleSearch} value={query}
        />
        <button    >
          <FaSearch className='text-slate-600'  />
        </button>
      </form>
      <div className='flex items-center gap-7'>
                
                <div className='relative flex justify-center'>

                  {
                    currentUser?._id && (
                      <div className='text-3xl cursor-pointer relative flex justify-center' onClick={()=>setMenuDisplay(preve => !preve)}>
                        {
                          currentUser.image ? (
                            <img src={currentUser.image} className='w-10 h-10 rounded-full' alt={currentUser?.name} />
                          ) : (
                            <FaRegCircleUser/>
                          )
                        }
                      </div>
                    )
                  }
                  
                  
                  {
                    menuDisplay && (
                      <div className='absolute bg-white bottom-0 top-11 h-fit p-2 shadow-lg rounded' >
                        <nav>
                          {
                           currentUser.Role === "Admin" && (
                              <Link to={"/admin-panel"} className='whitespace-nowrap hidden md:block hover:bg-slate-100 p-2' onClick={()=>setMenuDisplay(preve => !preve)}>Admin Panel</Link>
                            )
                          }
                         
                        </nav>
                      </div>
                    )
                  }
                 
                </div>

                  {
                    currentUser?._id && (
                      <Link to={"/cart"} className='text-2xl relative'>
                          <span><FaShoppingCart/></span>
      
                          <div className='bg-red-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3'>
                              <p className='text-sm'>  {carts.length} </p>
                          </div>
                      </Link>
                      )
                  }
              


                <div>
                  {
                    currentUser?._id  ? (
                      <button onClick={handleLogout} className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'>Logout</button>
                    )
                    : (
                    <Link to={"/login"} className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'>Login</Link>
                    )
                  }
                    
                </div>

            </div>

    </div>
  </header>
)

  }
export default Navbar