import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state,action) => {
            const{user, token} = action.payload;
            state.user =  action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;

            if(user.role === "customer"){
                sessionStorage.setItem("customerToken", token);
                sessionStorage.setItem("customerUser", JSON.stringify(user));
            } else if(user.role === 'provider'){
                sessionStorage.setItem("providerToken", token);
                sessionStorage.setItem("providerUser",JSON.stringify(user));
            } else if(user.role === "admin"){
                sessionStorage.setItem("adminToken", token);
                sessionStorage.setItem("adminUser", JSON.stringify(user));
            }
        },
        logout: (state) => {
            const role = state.user?.role;
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            if(role === "customer"){
                sessionStorage.removeItem("customerToken");
                sessionStorage.removeItem("customerUser");
            } else if(role === "provider"){
                sessionStorage.removeItem("providerToken");
                sessionStorage.removeItem("providerUser");
            } else if(role === "admin"){
                sessionStorage.removeItem("adminToken");
                sessionStorage.removeItem("adminUser");
            }
        }
    }
})
export const {loginSuccess, logout}  = authSlice.actions;
export default authSlice.reducer;