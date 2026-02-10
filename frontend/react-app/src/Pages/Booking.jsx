import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useEffect, useState } from 'react'

function Booking() {

   const {user, isAuthenticated} = useSelector(state => state.auth) 
   const navigate = useNavigate();
   const dispatch = useDispatch();

   const[services, setServices] = useState([]);
   const[bookings, setBookings] = useState([]);
   const[searchQuery, setSearchQuery] = useState("");
   const[selectedDate, setSelectedDate] = useState(
      new Date().toISOString().split("T")[0]
   );
   const[stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0
   });
  

   //filtered Search for efficient browsing
   const filterdServices = searchQuery
   ? services.filter((s)=>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
   ) : services;


   //fetch Services
   const fetchServices = async () => {
    try{
    const res = await api.get("/api/service");
    setServices(res.data);
    }catch(error){
    console.error(error);
    }
   }

   //fetch customer Bookings
   const fetchBooking = async () => {
    try{
    const res = await api.get("/api/booking/customer/me")
    setBookings(res.data);
    setStats({
        total: res.data.length,
        upcoming: res.data.filter((b)=> b.status === "confirmed").length,
        completed: res.data.filter((b)=> b.status === "completed").length,
        cancelled: res.data.filter((b)=> b.status === "cancelled").length,

    })
    }catch(error){
   console.error(error);
    }
   }
   useEffect(()=>{
   if(!isAuthenticated) return;
    fetchServices();
    fetchBooking();
   },[]);
   
   //handle Logout
   const handleLogout = () => {
    dispatch(logout());
    navigate("/")
   }
   //Book a Service
   const bookService = async (service) => {
        console.log("SERVICE:", service);
    try{
    await api.post("/api/booking", {
       serviceId: service._id,   
       providerId: service.providerId, //Required
       date: selectedDate //Required
    },
    {
      headers:{
         Authorization: `Bearer ${user.token}`
      }
    });
    fetchBooking(); // refresh bookings
    alert("Booking requested! Pending confirmation. ");
    }catch(error){
        console.error(error);
        alert("Error booking service");
    }
   }
   if(!isAuthenticated){
    return <p>Please login as Provider to create Service</p>
   }
   if(!user) return <p>Loading user...</p>

   return (
       <>
       <div className=' bg-gray-100'
    >

    {/*Header */}
    <div className='bg-white shadow px-6 py-4 flex justify-between items-center '>
      <h1 className='text-2xl font-bold'>Customer Dashboard</h1>
      <div className='flex items-center gap-4'>
        <span className='text-gray-600'>Hello, {user.name}</span>
      <button onClick={handleLogout} className='px-4 py-2 bg-red-500 text-white rounded-xl cursor-pointer  hover:bg-red-700'>
        Logout
      </button>
      </div>
    </div>
    </div>
    {/*Stats*/}
    <div className='grid grid-cols-1  md:grid-cols-4 gap-4 p-5'>
    {/*total Bookings*/}
    <div className='bg-blue-600 w-50 p-4 text-center rounded-2xl'>
    <h1 className='text-white font-bold'>Total Bookings</h1>
    <p>{stats.total}</p>
    </div>
    {/*Upcoming*/}
    <div className='bg-yellow-600 w-50 p-4 text-center rounded-2xl'>
    <h1 className='text-white font-bold'>Upcoming</h1>
    <p>{stats.upcoming}</p>
    </div>
     {/*completed*/}
    <div className='bg-green-600 w-50 p-4 text-center rounded-2xl'>
    <h1 className='text-white font-bold'>Completed</h1>
    <p>{stats.completed}</p>
    </div>
     {/*cancelled*/}
    <div className='bg-purple-600 w-50 p-4 text-center rounded-2xl'>
    <h1 className='text-white font-bold'>Cancelled</h1>
    <p>{stats.cancelled}</p>
    </div>
    </div>

    {/* === Main Action Area === */}
   <div className='flex flex-col md:flex-row gap-6 mb-6'>
   {/* left: Browse Section*/}
   <div className='flex-1 bg-gray-100  p-4 rounded-2xl shadow'>
      <h2 className='text-xl font-bold mb-3 border-b border-gray-200 pb-2'>
         Browse Service
      </h2>
      <div className='mb-4'>
         <input type="text"
         placeholder='Search Services'
         value={searchQuery} 
         onChange={(e)=> setSearchQuery(e.target.value)}
         className='w-64 box-border bg-white border border-gray-200 shadow p-2 rounded-lg focus:outline-none focus-ring-2 focus:ring-blue-500'/>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
         {filterdServices.map((s)=> {
            return(
            <div key={s._id} className='bg-white border border-gray-200 p-5 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 '>
            <h3 className='text-lg font-semibold text-gray-800'>{s.title}</h3>
            <p className='text-sm text-gray-500 mt-2 line-clamp-3'>{s.description}</p>
            <p className='text-gray-600 font-medium mt-2'>
               Price: ${s.price} | Duration: {s.duration}
            </p>
            <button
            onClick={()=> bookService(s)}
            className='mt-3 px-3 py-1 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700'>
               Book Now
            </button>
            </div>
            )
         })}
      </div>
   </div>
   </div>
   {/* === Bottom: Booking History === */}
   <div className=' bg-white rounded-xl w-350  shadow p-5  flex flex-col m-4'>
      <h2 className='text-xl bg-white  rounded-lg shadow p-4  font-bold mb-3 border-b border-gray-200 pb-2'>
         Booking History
      </h2>
      {bookings.length === 0 ? (
         <p className='text-gray-500'>No Bookings yet.</p>
      ):(
         
         <table className='w-full text-left border-collapse'>

         <thead className='text-gray-700 '>
            <tr className='bg-gray-100'>
            <th className='p-3 '>Booking ID</th>
            <th className='p-3 '>Service</th>
            <th className='p-3'>Provider</th>
            <th className='p-3'>Date</th>
            <th className='p-3'>Status</th>
            </tr>
         </thead>
         <tbody>
            {bookings.map((b)=> (
               <tr key={b._id} className=''>
               <td className='p-2'>{b._id.slice(0,6)}</td>
               <td className='p-2'>{b.serviceId?.title}</td>
               <td className='p-2'>{b.providerId?.name}</td>
               <td className='p-2'>{new Date(b.createdAt).toLocaleDateString()}</td>
               <td className='p-2'>{b.status}</td> 
               </tr>
            ))}
         </tbody>
         </table>
      )}
   </div>
  
 </>
  )
}
export default Booking