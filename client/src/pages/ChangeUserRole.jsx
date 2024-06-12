import  { useState } from 'react';
import { useDispatch,useSelector} from 'react-redux';

import { useNavigate } from 'react-router-dom';
import {  getuserbyid, updateuserprofile } from '../Redux/userSlice';
import { IoMdClose } from "react-icons/io";

const ChangeUserRole = ({onClose,name,userId,Role,email}) => {
  console.log("Props received in ChangeUserRole:", onClose,name,userId,Role,email );

    const navigate = useNavigate()
    const dispatch=useDispatch()

    const user = useSelector(state => state.AuthReducer.user);

  const [updatedUser, setUpdatedUser] = useState({

    _id:userId,
    name:name,
    email:email,
    Role:Role,
  })


  const handleChange = (e) => {

    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value })
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
  
    try {

      navigate(`/admin-panel/allusers/${user._id}`)
      dispatch(getuserbyid(userId)) 
  
      await dispatch(updateuserprofile(updatedUser));

      navigate('/admin-panel/allusers');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };



 
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 w-full h-full z-10 bg-slate-200 bg-opacity-50 flex justify-between items-center">
      <div className="mx-auto bg-white shadow-md p-4 w-full max-w-sm rounded">
        <button className="block ml-auto text-gray-500 hover:text-gray-700" onClick={onClose} >
          <IoMdClose size={24} />
        </button>
  
        <h1 className="text-lg font-medium text-gray-900 pb-4">Change User Details</h1>
  
        <div className="flex flex-col space-y-4">
          <div className="w-full">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              name:
            </label>
            <input
              type="name"
              id="name"
              name="name"
              placeholder="name"
              className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              defaultValue={updatedUser.name}
              onChange={handleChange}
            />
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="email"
              className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              defaultValue={updatedUser.email}
              onChange={handleChange}
            />
          </div>
          <div className="w-full">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="password"
              className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              defaultValue={updatedUser.password} // Assuming you want password editing
              onChange={handleChange}
            />
          </div>
  
          
  
          <div className="flex items-center justify-between my-4">
            <p>Role:</p>
            <select className="border px-4 py-1 rounded-lg"  type="password"
              id="Role"
              name="Role" 
              defaultValue={updatedUser.Role}
              onChange={handleChange}>
    <option key='Admin'>Admin</option>
    <option key='User'>User</option>

</select>
          </div>
  
          <button
            className="w-fit mx-auto block py-1 px-3 rounded-full bg-red-600 text-white hover:bg-red-700"
            onClick={handleUpdate}
          >
            Change Role
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangeUserRole