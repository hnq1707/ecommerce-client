import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';
import productReducer from './features/product/productSlice';
import categoryReducer from './features/category/categorySlice';
import authReducer from './features/auth/authSlice';
import userReducer from './features/user/userSlice';
import orderReducer from './features/order/orderSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Sử dụng localStorage
import { combineReducers } from 'redux';

// Cấu hình redux-persist
const persistConfig = {
  key: 'root', // Key để lưu vào localStorage
  storage, // Sử dụng localStorage để lưu trữ
  whitelist: ['cart'], // Chỉ persist cart, bỏ product nếu không cần lưu
};

// Kết hợp reducers
const rootReducer = combineReducers({
  cart: cartReducer,
  product: productReducer,
  category: categoryReducer,
  auth: authReducer,
  user: userReducer,
  order:orderReducer
});

// Tạo persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Bỏ kiểm tra serializable để tránh lỗi khi lưu vào localStorage
    }),
});

// Tạo persistor để sử dụng với PersistGate
export const persistor = persistStore(store);

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
