import { createSlice } from "@reduxjs/toolkit";

const initialState = {
 
    list: [],
};

const bookingSlice = createSlice({
    name: "bookings",
    initialState,
    reducers: {
        setBooking: (state,action) => {
          state.list = action.payload  
        },
        addBooking: (state,action) => {
            state.list.push(action.payload) // add new Booking
        },
        updateBooking: (state,action) => {
            const index = state.list.findIndex(b => b._id === action.payload._id);
            if(index !== -1) state.list[index] = action.payload
        }
    }

})
export const {setBooking, addBooking, updateBooking} = bookingSlice.actions;
export default bookingSlice.reducer