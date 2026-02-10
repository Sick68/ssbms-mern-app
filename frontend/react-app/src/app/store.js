import {configureStore} from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import bookingReducers from "../features/booking/bookingSlics.js";
export const store = configureStore({
    reducer: {
     auth: authReducer,
    },
    devTools : true
});