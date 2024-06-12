import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { auth, provider } from "../firebase";
import axios from 'axios';
import { signInWithPopup } from '@firebase/auth';

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

export const signingUp = createAsyncThunk('user/signingUp', async (newUser, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('http://localhost:5000/api/users/register', newUser);
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data.message ? error.response.data.message : error.response.data.errors);
  }
});

export const signingIn = createAsyncThunk('user/signingIn', async (user, { rejectWithValue, dispatch }) => {
  try {
    const { data } = await axios.post('http://localhost:5000/api/users/login', user);

    return data;
  } catch (error) {
    return rejectWithValue(error.response.data.message ? error.response.data.message : error.response.data.errors);
  }
});

export const signInWithGoogle = createAsyncThunk('user/signInWithGoogle', async (_, { dispatch, rejectWithValue }) => {
  try {
    const result = await signInWithPopup(auth, provider);
    const { displayName, email, photoURL } = result.user;

    const { data } = await axios.post('http://localhost:5000/api/users/google', {
      name: displayName,
      email,
      img: photoURL
    });

    return data;
  } catch (error) {
    console.error(error);
    return rejectWithValue(error.response.data.message ? error.response.data.message : error.response.data.errors);
  }
});


export const Allusers= createAsyncThunk('user/Allusers', async (_,{rejectWithValue})=>{

  try {

      const {data} = await axios.get('http://localhost:5000/api/users/admin-panel/allusers')
      return data
  } catch (error) {
     return rejectWithValue(error.response.data.message? error.response.data.message : error.response.data.errors )
  }

})


export const getuserbyid= createAsyncThunk('user/getuserbyid', async (id,{rejectWithValue})=>{
  const config = createConfig();

  try {
    
      const {data} = await axios.get(`http://localhost:5000/api/users/admin-panel/allusers/${id}`,config)
      return data
  } catch (error) {
     return rejectWithValue(error.response.data.message? error.response.data.message : error.response.data.errors )
  }

})
export const updateuserprofile= createAsyncThunk('user/updateuserprofile', async (updatedUser ,{rejectWithValue})=>{
  const config = createConfig();

  try {
      const {data} = await axios.put(`http://localhost:5000/api/users/admin-panel/allusers/${updatedUser._id}`,updatedUser ,config)

      return data
  } catch (error) {
     return rejectWithValue(error.response.data.message)
  }

})








const initialState = {
  currentUser: localStorage.getItem('ytc-user') ? JSON.parse(localStorage.getItem('ytc-user')) : {},

  isLoading: false,
  isAuth: Boolean(localStorage.getItem('isAuth')),
  token: localStorage.getItem('ytc-access-token') ? localStorage.getItem('ytc-access-token') : {},
  user: localStorage.getItem('ytc-user') ? JSON.parse(localStorage.getItem('ytc-user')) : {},
  registerErrors: null,
  loginErrors: null,
  msg: null,
  users: [],
  founduser:{},
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser={};
      state.user={}
      state.msg=null
      state.isAuth = false;
      state.token = null;
      localStorage.clear();

    },
    clearErrors: (state) => {
      state.loginErrors = null;
      state.registerErrors = null;
    },


    


  },
  extraReducers: (builder) => {
    builder
      .addCase(signingUp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signingUp.fulfilled, (state, { type, payload }) => {
        state.isLoading = false;
        state.msg = payload.msg;
        state.user = payload;
        state.currentUser=payload
      })
      .addCase(signingUp.rejected, (state, { type, payload }) => {
        state.registerErrors = payload;
      })
      .addCase(signingIn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signingIn.fulfilled, (state, { type, payload }) => {
        state.isLoading = false;
        state.isAuth = true;
        state.user = payload.isfound
        state.currentUser=payload.isfound
        state.msg = payload.msg;

        state.token= payload.token
        localStorage.setItem('token', payload.token )
        localStorage.setItem('user', JSON.stringify(payload.isfound) )
        localStorage.setItem('currentUser', JSON.stringify(payload.isfound) )

        localStorage.setItem('isAuth', true)

      })
      .addCase(signingIn.rejected, (state, { type, payload }) => {
        state.loginErrors = payload;
      })
      .addCase(signInWithGoogle.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signInWithGoogle.fulfilled, (state, { type, payload }) => {
        state.isLoading = false;
        state.user = payload.isfound;
        state.currentUser=payload.isfound
        state.msg = payload.msg;

        state.token = payload.token;
        state.isAuth = true;
        localStorage.setItem('isAuth', true);
        localStorage.setItem('token', payload.token);
        localStorage.setItem('user', JSON.stringify(payload.isfound));
        localStorage.setItem('currentUser', JSON.stringify(payload.isfound) )


      })
      .addCase(signInWithGoogle.rejected, (state, { type, payload }) => {
        state.loginErrors = payload;
      })
  
      .addCase(getuserbyid.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getuserbyid.fulfilled, (state, { type, payload }) => {
        state.isLoading = false;
        state.msg = payload.msg;
        state.user = payload;
      })
      .addCase(getuserbyid.rejected, (state, { type, payload }) => {
        state.registerErrors = payload;
      })
      .addCase(updateuserprofile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateuserprofile.fulfilled, (state, { type, payload }) => {
        state.isLoading = false;
        state.user = payload.updatedUser;
        state.msg = payload.msg;

      })
      
      .addCase(updateuserprofile.rejected, (state, { type, payload }) => {
        state.registerErrors = payload;
      })

      .addCase(Allusers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Allusers.fulfilled, (state, { type, payload }) => {
        state.isLoading = false;
        state.users = payload;

      })
      .addCase(Allusers.rejected, (state, { type, payload }) => {
        state.registerErrors = payload;
      })






      
  }
});

export const { logout, clearErrors } = userSlice.actions;

export default userSlice.reducer;