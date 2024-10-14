import { configureStore } from '@reduxjs/toolkit'
import lanReducer from '../features/language/lanSlice'
import serviceReducer from '../features/service/serviceSlice'
import professionReducer from '../features/profession/professionSlice'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import { combineReducers } from '@reduxjs/toolkit'

const persistConfig = {
  key: 'root',
  version: 1,
  storage
};

const reducer = combineReducers({
  language: lanReducer,
  service: serviceReducer,
  profession: professionReducer
});

const persistedReducer = persistReducer(persistConfig, reducer);


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})