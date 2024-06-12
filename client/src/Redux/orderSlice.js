import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

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

export const getordersuccess = createAsyncThunk('order/getordersuccess', async (_, { rejectWithValue }) => {
    try {
        const config = createConfig();
        console.log(config);

        const response = await axios.get('http://localhost:5000/api/orders/order', config);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message)
    }

})

export const getorderall = createAsyncThunk('order/getorderall', async (_, { rejectWithValue }) => {
    try {
        const config = createConfig();
        console.log(config);
        const { data } = await axios.get('http://localhost:5000/api/orders/admin-panel/allorder', config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message)
    }

})

 
    const orderSlice = createSlice({
        name: 'order',
        initialState: {
            orders: [],
            orderaded: [],
           
            loading: false,
            error: false,
       
            msg:{},
            payment:null,
            totalprice:{}
        },
    
        reducers: {
    
           
    
        },
    
    
    
        extraReducers: (builder) => {
            builder
              
    
    
            .addCase(getordersuccess.pending, (state) => {
                state.loading = true;
                state.error = null;
              })
              .addCase(getordersuccess.fulfilled, (state, action) => {
                state.loading = false;
                state.orderaded=action.payload .orderList|| 'Something went wrong.';

              })
              .addCase(getordersuccess.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Something went wrong.';
              })
    
    
              .addCase(getorderall.pending, (state) => {
                state.loading = true;
            })
            .addCase(getorderall.fulfilled, (state, { type, payload }) => {
                state.loading = false;
                state.orders = payload.orders;
                state.msg= payload.message
                
            })
            .addCase(getorderall.rejected, (state, { type, payload }) => {
                state.error = payload;
            })
    
    
    
    
    
    
        },
    });
    
    
    
    
    export default orderSlice.reducer;
