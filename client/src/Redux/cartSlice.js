import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';



const createConfig = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return {
            headers: {
                
                token
            }
        };
    } else {
        return {};
    }
}

export const addcart = createAsyncThunk('cart/addcart', async ( { productId: id }, { rejectWithValue }) => {
    try {
        const config = createConfig();
        const { data } = await axios.post(`http://localhost:5000/api/addtocart/product/${id}`, {productId: id},  config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const handlePayment = createAsyncThunk('cart/handlePayment',async (productCartItems, { getState, rejectWithValue }) => {
    try {
        const  REACT_APP_STRIPE_PUBLIC_KEY="pk_test_51PNaqIAUABmyr4e2uwcfyzetiUdzvPudT6oOcrb7FlChDHBOmIkz44F0fDRM6NchSCFgBT3KHy8NShyDsbiHLNov00RfJDgXok"

        const config = createConfig();
        const stripePromise = await loadStripe(REACT_APP_STRIPE_PUBLIC_KEY);
   // Extract necessary data for Stripe
   const itemsForCheckout = productCartItems.map(item => ({
    _id: item._id,
    quantity: item.quantity,
    productId: {
        productName: item.productId.productName,
        sellingPrice: item.productId.sellingPrice,
        imgUrl:item.productId.imgUrl
    }
}));

    // Log the request payload
    console.log('Request payload:', { carts: itemsForCheckout });

        const { data } = await axios.post(
          'http://localhost:5000/api/addtocart/cart',
          { carts: itemsForCheckout },
        
          config
        );
        console.log('Response data:', data);

        // Assuming data contains sessionId
        const sessionId = data.sessionId;
      
        // Redirect to checkout page
        const stripe = await stripePromise;
        stripe.redirectToCheckout({ sessionId });
      
        // Return stripe and sessionId
        return { stripe, sessionId };

    } catch (error) {
        // Log the error
        console.error('Error:', error.response || error.message);
    
        // Handle errors
        const errorMessage = error.response?.data?.message || error.message;
        return rejectWithValue(errorMessage);
      }
    });














export const addcartview = createAsyncThunk('cart/addcartview', async (_, { rejectWithValue }) => {
    try {
        const config = createConfig();
        const { data } = await axios.get(`http://localhost:5000/api/addtocart/cart`, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const updateaddcart= createAsyncThunk('cart/updateaddcart', async ({ _id, quantity },{rejectWithValue})=>{
    const config = createConfig();
  
    try {
        const {data} = await axios.put(`http://localhost:5000/api/addtocart/cart/${_id}`,{quantity} ,config)
        return data
    } catch (error) {
       return rejectWithValue(error.response.data.message)
    }
  
  })



  export const deletecart = createAsyncThunk('cart/deletecart', async(_id,{rejectWithValue,dispatch})=>{
    try {
      const config = createConfig();
  
        const {data} = await axios.delete(`http://localhost:5000/api/addtocart/cart/${_id}`,config)
        return data
    } catch (error) {
        return rejectWithValue(error.response.data.message)
    }
  })
  
  export const addcartall = createAsyncThunk('cart/addcartall', async (_, { rejectWithValue }) => {
    try {
        const config = createConfig();
        const { data } = await axios.get(`http://localhost:5000/api/addtocart/admin-panel/allcarts`, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});





const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        carts: [],
        cartaded: {},
        currentcart: {},
        loading: false,
        error: false,
        recom: [],
        msg:{},
        payment:null,
        totalprice:{}
    },

    reducers: {

        fetchStart: (state) => {
            state.loading = true;
        },
        fetchSuccess: (state, action) => {
            state.loading = false;
            state.currentproduct = action.payload;
        },
        fetchFailure: (state) => {
            state.loading = false;
            state.error = true;
        },

    },



    extraReducers: (builder) => {
        builder
            .addCase(addcart.pending, (state) => {
                state.loading = true;
            })
            .addCase(addcart.fulfilled, (state, { type, payload }) => {
                state.loading = false;
                state.cartaded = payload;
                state.msg=payload.message
            })
            .addCase(addcart.rejected, (state, { type, payload }) => {
                state.error = payload;
            })
            .addCase(addcartview.pending, (state) => {
                state.loading = true;
            })
            .addCase(addcartview.fulfilled, (state, { type, payload }) => {
                state.loading = false;
                state.carts= payload.carts;
                state.totalprice=payload.totalprice
            })
            .addCase(addcartview.rejected, (state, { type, payload }) => {
                state.error = payload;
            })
            .addCase(updateaddcart.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateaddcart.fulfilled, (state, { type, payload }) => {
                state.loading = false;
                state.currentcart= payload.updateaddcart;
                state.msg=payload.msg
            })
            .addCase(updateaddcart.rejected, (state, { type, payload }) => {
                state.error = payload;
            })
            .addCase(deletecart.pending, (state) => {
                state.loading = true;
            })
            .addCase(deletecart.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload && action.payload.deleteProduct && action.payload.deleteProduct._id) {
                    state.msg=action.payload.msg

                    state.carts = state.carts.filter(cart => cart._id !== action.payload.deleteProduct._id);
                } else {
                    state.msg = "Failed to delete the product. Invalid response from server.";
                }
            })
            .addCase(deletecart.rejected, (state, { type, payload }) => {
                state.error = payload;
            })


            .addCase(handlePayment.pending, (state) => {
                state.loading = true;
                state.error = null;
              })
              .addCase(handlePayment.fulfilled, (state, action) => {
                state.loading = false;
                state.payment=action.payload || 'Something went wrong.';

              })
              .addCase(handlePayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Something went wrong.';
              })

              .addCase(addcartall.pending, (state) => {
                state.loading = true;
            })
            .addCase(addcartall.fulfilled, (state, { type, payload }) => {
                state.loading = false;
                state.carts= payload.carts;
                
            })
            .addCase(addcartall.rejected, (state, { type, payload }) => {
                state.error = payload;
            })










    },
});




export default cartSlice.reducer;
export const { fetchStart, fetchSuccess, fetchFailure} = cartSlice.actions;