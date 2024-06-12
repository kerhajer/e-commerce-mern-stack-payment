import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import empty from "../assets/empty.gif";
import displayINRCurrency from '../helpers/displayCurrency';
import { getorderall } from '../Redux/orderSlice';

const Allcarts = () => {
  const orders = useSelector(state => state.orderreducer.orders)||[]
  console.log(orders)
  const loading=useSelector(state => state.orderreducer.loading)
  const dispatch=useDispatch()
  useEffect(() => {
    dispatch(getorderall()); 
}, []);


   
  
    return (
      <div className='container mx-auto'>
        <div className='text-center text-lg my-3'>
          {(!orders || orders.length === 0) && !loading && (
            <div className="flex w-full justify-center items-center flex-col">
              <img src={empty} className="w-full max-w-sm" alt="Empty cart"/>
              <p className="text-slate-500 text-3xl font-bold"> no order Empty</p>
            </div>
          )}
        </div>
  
        <div className='flex flex-col gap-10 p-4'>
          {loading ? (
            new Array(4).fill(null).map((_, index) => (
              <div key={index} className='w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded'></div>
            ))
          ) : (
            <table className='w-full userTable'>
              <thead>
                <tr className='bg-black text-white'>
                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>USER</th>
                  <th>PRODUCT</th>
                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>shipp</th>

                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>Total Price</th>

                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>Payment Status</th>

                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>payment method</th>
                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders && orders?.map((group, idx) => (
                  <tr key={idx}>
                    <td rowSpan={group.productDetails?.length || 1} style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center', verticalAlign: 'middle' }}>
                      {group.email}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                      {group.productDetails && group.productDetails.map((product, index) => (
                        <div key={product.productId} className='w-full bg-white h-32 my-2 border border-slate-300 rounded grid grid-cols-[128px,1fr]'>
                          <div className='w-32 h-32 bg-slate-200'>
                            <img src={product.image} className='w-full h-full object-scale-down mix-blend-multiply' />
                          </div>
                          <div className='px-4 py-2 relative'>
                            <h2 className='text-lg lg:text-xl text-ellipsis line-clamp-1'>{product.name}</h2>
                            <div className='flex items-center justify-between'>
                              <p className='text-red-600 font-medium text-lg'>{displayINRCurrency(product.price)}</p>
                              <p className='text-slate-600 font-semibold text-lg'>{displayINRCurrency(product.price * product.quantity)}</p>
                            </div>
                            <div className='flex items-center gap-3 mt-1'>
                              <span>quantity: {product.quantity}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </td>
                    <td   style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                     100
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                      <strong> {displayINRCurrency(group.paymentDetails.totalAmount)}</strong>
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                      {group.paymentDetails.payment_status}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                      {group.paymentDetails.payment_method_type[0]}
                    </td>
                    
                    <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                      {moment(group.createdAt).format('LL')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

export default Allcarts;