import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './usersSlice';
// configuracion del redux
const store = configureStore({
  reducer: {
    users: usersReducer,
  },
});

export default store;
