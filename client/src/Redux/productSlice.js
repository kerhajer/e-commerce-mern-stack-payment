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

export const addProduct = createAsyncThunk('product/addProduct', async ({ inputs }, { rejectWithValue }) => {
    try {
        const config = createConfig();

        const { data } = await axios.post('http://localhost:5000/api/products/admin-panel/random', {...inputs}, config)

        return data
    } catch (error) {
        return rejectWithValue(error.response.data.message)
    }

})







export const getProduct = createAsyncThunk('product/getProduct', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('http://localhost:5000/api/products/admin-panel/random', _);
        return data

    } catch (error) {
        return rejectWithValue(error.response.data.message)
    }

})

 
  export const UpdatePRODUCT = createAsyncThunk('product/UpdatePRODUCT', async(updatedproduct,{rejectWithValue,dispatch})=>{

  
    try {
        const config = createConfig();
        const {data} = await axios.put(`http://localhost:5000/api/products/admin-panel/random/${updatedproduct._id}`,updatedproduct,config)

        return data
    } catch (error) {
       return rejectWithValue(error.response.data.message)
    }
  
  })
  export const getproductwisebycategory = createAsyncThunk('product/getproductwisebycategory', async ( categories , { rejectWithValue, dispatch }) => {
      try {
        const { data } = await axios.post('http://localhost:5000/api/products', categories);
        return data;
      } catch (error) {
        return rejectWithValue(error.response.data.message);
      }
    }
  );
  export const searchbycategory = createAsyncThunk('product/searchbycategory', async(category,{rejectWithValue,dispatch})=>{

    try {

        const {data} = await axios.post('http://localhost:5000/api/products/product-category',category)

        return data
    } catch (error) {
       return rejectWithValue(error.response.data.message)
    }
  
  })
  export const searchQ = createAsyncThunk('product/searchQ',async (query, { rejectWithValue }) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/search?q=${query}`);
        return response.data; // Return the actual product data
      } catch (error) {
        if (error.response && error.response.data.message) {
          return rejectWithValue(error.response.data.message); // Handle specific error messages
        } else {
          return rejectWithValue('An error occurred during search. Please try again later.'); // Generic error message for unexpected issues
        }
      }
    }
  );


  export const getproductbyid = createAsyncThunk('product/getproductbyid', async (id, { rejectWithValue }) => {
      try {
        const config = createConfig();

        const {data} = await axios.get(`http://localhost:5000/api/products/admin-panel/random/${id}`,config);
        return data
    } catch (error) {
        return rejectWithValue(error.response.data.message)
     }
   
   })

  export const getproductByCategory = createAsyncThunk('product/getproductByCategory', async (_, { rejectWithValue }) => {
    try {
        
        const { data } = await axios.get('http://localhost:5000/api/products/', _);
        return data

    } catch (error) {
        return rejectWithValue(error.response.data.message)
    }

})


export const deleateproduct = createAsyncThunk('product/deleateproduct', async(id,{rejectWithValue,dispatch})=>{
    try {
      const config = createConfig();
  
        const {data} = await axios.delete(`http://localhost:5000/api/products/admin-panel/random/${id}`,config)
        return data
    } catch (error) {
        return rejectWithValue(error.response.data.message)
    }
  })
  



  

const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
        productaded: {},
        currentproduct: {},
        likes: [],
        loading: false,
        error: false,
        recom: [],
        msg:{},
        categoryProduct: [],
        filtredproduct: {},
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
            .addCase(addProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(addProduct.fulfilled, (state, { type, payload }) => {
                state.loading = false;
                state.productaded = payload.newProduct;
                state.msg = payload.message;

            })
            .addCase(addProduct.rejected, (state, { type, payload }) => {
                state.error = payload;
            })
            .addCase(getProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProduct.fulfilled, (state, { type, payload }) => {
                state.loading = false;
                state.products = payload;
            })
            .addCase(getProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            .addCase(UpdatePRODUCT.pending, (state) => {
                state.loading = true;
                state.error = null;
              })
              .addCase(UpdatePRODUCT.fulfilled, (state, {type,payload}) => {
                state.loading = false;
                state.currentproduct = payload.updatedproduct
              })
              .addCase(UpdatePRODUCT.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
              })


              .addCase(getproductbyid.pending, (state) => {
                state.loading = true;
              })
              .addCase(getproductbyid.fulfilled, (state, { type, payload }) => {
                state.loading = false;
                state.msg = payload.msg;
                state.currentproduct= payload;
              })
              .addCase(getproductbyid.rejected, (state, { type, payload }) => {
                state.registerErrors = payload;
              })



              .addCase(getproductByCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getproductByCategory.fulfilled, (state, { type, payload }) => {
                state.loading = false;
                state.categoryProduct= payload;
            })
            .addCase(getproductByCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            
            .addCase(getproductwisebycategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(getproductwisebycategory.fulfilled, (state, { type, payload }) => {
                state.loading = false;
                state.filtredproduct= payload.data;

            })
            .addCase(getproductwisebycategory.rejected, (state, { type, payload }) => {
                state.error = payload;
            })


            .addCase(searchbycategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(searchbycategory.fulfilled, (state, { type, payload }) => {
                state.loading = false;
                state.filtredproduct = payload.data;

            })
            .addCase(searchbycategory.rejected, (state, { type, payload }) => {
                state.error = payload;
            })

            .addCase(searchQ.pending, (state) => {
                state.loading = true;
            })
            .addCase(searchQ.fulfilled, (state, { type, payload }) => {
                state.loading = false;
                state.products = payload;

            })
            .addCase(searchQ.rejected, (state, { type, payload }) => {
                state.error = payload;
            })
            .addCase(deleateproduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleateproduct.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload && action.payload.deletedproduct && action.payload.deletedproduct._id) {
                    state.products = state.products.filter(cart => cart._id !== action.payload.deletedproduct._id);
                } else {
                    state.error = "Failed to delete the product. Invalid response from server.";
                }
            })
            .addCase(deleateproduct.rejected, (state, { type, payload }) => {
                state.error = payload;
            })





    },
});




export default productSlice.reducer;
export const { fetchStart, fetchSuccess, fetchFailure} = productSlice.actions;