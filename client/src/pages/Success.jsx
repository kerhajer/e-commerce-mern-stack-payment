import { Link } from 'react-router-dom';
import check from "../assets/check.gif"

const Success = () => {
  return (
    <div className='bg-white-200 w-full max-w-md m-auto h-56 flex flex-col justify-center items-center font-semibold text-lg space-y-4 p-4'>
      <img 
        src={check} 
        alt='Success Icon' 
        className='w-30 h-20'
      />
      <p>Payment is Successful</p>
      <Link 
        to={'/order'} 
        className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
      >
        See Order
      </Link>
    </div>
  );
}

export default Success;