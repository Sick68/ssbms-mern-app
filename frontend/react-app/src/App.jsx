import { Route, Routes, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import api from './api/axios.jsx'
import RegisterLogin from './Pages/RegistUser.jsx'
import ProviderDasboard from './Pages/ProviderDasboard.jsx'
import { useSelector } from 'react-redux'
import Booking from './Pages/Booking.jsx'
import AdminDasboard from './Pages/AdminDasboard.jsx'

function App() {
  const {user,isAuthenticated} = useSelector(state => state.auth);
  useEffect(() => {
    api.get("/") // <- We'll create this temporary endpoint
      .then(res => {
        console.log("Backend connected:", res.data);
      })
      .catch(err => {
        console.error("Backend error:", err.message);
      });
  }, []);

  return (
    <div className="App">
    <Routes>
    
       {/*public route*/}
       <Route path='/' element = {<RegisterLogin></RegisterLogin>}/>
       {/*Protected route: only logged in provider */}
       <Route path = '/service'
        element = { isAuthenticated && user?.role === "provider" ? (
        <ProviderDasboard/>
       ) : (
        <Navigate to="/" /> //redirect if not authorized
       )  
       }
       />
       <Route path = "/booking"
       element = {isAuthenticated && user?.role === "customer" ? (
        <Booking/>
       ):(
        <Navigate to= "/" />
       )
       }
       />
      <Route path='/admin' 
      element = {isAuthenticated && user?.role === "admin" ? (
       <AdminDasboard/>   
      ) : (
        <Navigate to="/"/>
      )
    } 
       
       
       /> 
    
    </Routes>
    </div>
  );
}

export default App;


