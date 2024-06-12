import  { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, Outlet, useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const currentUser = useSelector(state => state.AuthReducer.currentUser)
    const navigate = useNavigate()


    useEffect(()=>{
        if(currentUser.Role !== "Admin"){
            navigate("/admin-panel")
        }
    },[currentUser])

  return (
    <div className='min-h-[calc(100vh-120px)] md:flex hidden'>

        <aside className='bg-white min-h-full  w-full  max-w-60 customShadow'>
                <div className='h-32  flex justify-center items-center flex-col'>
                    <div className='text-5xl cursor-pointer relative flex justify-center'>
                        {
                        currentUser?.img? (
                            <img src={currentUser.img} className='w-20 h-20 rounded-full' alt={currentUser?.name} />
                        ) : (
                            <FaRegCircleUser/>
                        )
                        }
                    </div>
                    <p className='capitalize text-lg font-semibold'>{currentUser.name}</p>
                    <p className='text-sm'>{currentUser.Role}</p>
                </div>

                <div>   
                    <nav className='grid p-4'>
                        <Link to={"allusers"}   className='px-2 py-1 hover:bg-slate-100'>All Users</Link>
                       
                        <Link to={"random"} className='px-2 py-1 hover:bg-slate-100'>All product</Link>
                        <Link to={"allorder"} className='px-2 py-1 hover:bg-slate-100'>All carts</Link>

                    </nav>
                </div>  
        </aside>

        <main className='w-full h-full p-2'>
            <Outlet/>
        </main>
    </div>
  )
}

export default AdminPanel