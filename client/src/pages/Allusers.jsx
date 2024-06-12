import  { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Allusers ,getuserbyid} from '../Redux/userSlice';
import moment from 'moment'
import { MdModeEdit } from "react-icons/md";
import ChangeUserRole from './ChangeUserRole';

const AllUsers = () => {

    const dispatch=useDispatch()
    const users = useSelector(state => state.AuthReducer.users)||[];
    console.log( 'users',users)
    const [openUpdateRole, setOpenUpdateRole] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    useEffect(() => {
      console.log('Dispatching Allusers action');
      dispatch(Allusers());
    }, [dispatch]);
  
    useEffect(() => {
      console.log('Users from state:', users);
    }, [users]);
  
   
    if (!Array.isArray(users)) {
      console.error('Users data is not an array:', users);
      return <div>Error: Users data is not an array.</div>;
    }
    useEffect(() => {
      console.log('Users from state:', users);
      console.log('Selected user:', selectedUser);  // Debug selected user
    }, [users, selectedUser]);

    const handleEditUser = user => {
      setSelectedUser(user);
      setOpenUpdateRole(true);
    };
  
    return (
      <div className='bg-white pb-4'>
        <table className='w-full userTable'>
          <thead>
            <tr className='bg-black text-white'>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>Sr.</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>Name</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>Email</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>Role</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}> Created Date</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody className=''>
            {users.map((el, index) => (
              <tr  key={el._id}>
                <td  style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>{index + 1}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>{el?.name}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>{el?.email}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>{el?.Role}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>{moment(el?.createdAt).format('LL')}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                  <button
                    className='bg-green-100 p-2 rounded-full cursor-pointer hover:bg-green-500 hover:text-white'
                    onClick={() => handleEditUser(el)}
                  >
                 <MdModeEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {openUpdateRole && (
          <ChangeUserRole
            onClose={() => setOpenUpdateRole(false)}
            name={selectedUser?.name}
            email={selectedUser?.email}
            Role={selectedUser?.Role}
            userId={selectedUser?._id}
          />
        )}
      </div>
    );
  };
  
  export default AllUsers;