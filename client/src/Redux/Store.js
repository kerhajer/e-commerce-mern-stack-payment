
import AuthReducer from "./userSlice"
import productreducer from './productSlice';
import cartreducer from './cartSlice'
import orderreducer from './orderSlice'
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';


const   rootReducer = combineReducers({
   AuthReducer,productreducer,cartreducer,orderreducer

})





const persistConfig = {
  key: 'root',
  storage, // Use the storage mechanism you want
  blacklist: ['orderreducer'] // Exclude orderreducer from being persisted
  // You can also configure blacklist or whitelist here
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const Store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer
});

export const Persistor = persistStore(Store);



