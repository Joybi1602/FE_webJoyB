import {  combineReducers, configureStore } from '@reduxjs/toolkit'
import  ProductReducer  from './slides/ProductSlide'
import  userReducer  from './slides/UserSlide'
import  OderReducer  from './slides/OrderSlide'
import { persistStore, persistReducer, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, FLUSH } from 'redux-persist';
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['order'] 
};

const rootReducer = combineReducers({
  product: ProductReducer,
  user: userReducer,
  order: OderReducer
},)

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleCheck) =>
      getDefaultMiddleCheck({
        serializableCheck: {
          ignoredAction: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        }
      })
})

export let persistor = persistStore(store)