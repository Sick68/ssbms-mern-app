import {useEffect, useState} from 'react'
import { logout } from '../features/auth/authSlice'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from "../api/axios";

function ProviderDasboard() {
 
  const{user, isAuthenticated} = useSelector(state => state.auth);

  const[serviceForm, setServiceForm] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
  }) 
  const[booking, setBookings] = useState([]);
  const[services,setServices] = useState([]);
  const[stats, setStats] = useState({
    toal: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();


  useEffect(()=> {
    if(!isAuthenticated) return;
    fetchBooking();
    fetchServices();
  },[isAuthenticated]);
 
 const handleServiceChange = (e) => {
  setServiceForm({ ...serviceForm, [e.target.name]: e.target.value });
  };

  //handler method for deleteService
  const handledeleteService = async (serviceId) => {
    try{
      await api.delete(`/api/service/delete/${serviceId}`);
      fetchServices(); 
    }catch(error){
     console.error("Delete service Error", error);
    }
  }
  //fetch booking that are related to sepecific provider
  const fetchBooking = async () => {
    try{
      const res = await api.get("/api/booking/provider/me");
     setBookings(res.data);
 
    setStats({
      toal: res.data.length,
      pending: res.data.filter((b)=> b.status === "pending").length,
      confirmed: res.data.filter((b)=> b.status === "confirmed").length,
      completed: res.data.filter((b)=> b.status === "completed").length
    })
   
    }catch(error){
      console.error("Provider fetch error: ", error.message);
    }
  }
const fetchServices = async () => {
  try {
    const res = await api.get("/api/service/provider/me"); // note: singular 'service'
    setServices(res.data);


  } catch (error) {
    console.error(error);
  }
};

  const updateStatus = async (id,status) => {
    try{
      await api.put(`/api/booking/status/${id}`, { status });
    fetchBooking();
    }catch(error){
    console.error(error.message);
    }
  };
  const createService = async (e) => {
    e.preventDefault();
    try{
      await api.post("/api/service", serviceForm);
      setServiceForm({title: "", description: "", price: "", duration: "",})
      
      fetchServices();
    }catch(error){
      console.error(error);
    }
  }
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  }
  if(!isAuthenticated) return <p className='p-6'>Please Login</p>
  return (
    <>
    <div className=' bg-gray-100'
    >

    {/*Header */}
    <div className='bg-white shadow px-4 md:px-6 py-4 flex md:flex-row  justify-between items-center md:items-center md:gap-0 '>
      <h1 className='text-2xl font-bold'>Provider Dashboard</h1>
      <div className='flex items-center gap-4'>
        <span className='text-gray-600'>Hello, {user.name}</span>
      <button onClick={handleLogout} className='px-4 py-2 bg-red-500 text-white rounded-xl  hover:bg-red-700'>
        Logout
      </button>
      </div>
    </div>
    </div>

    {/*Stats*/}
    <div className='grid grid-cols-1 md:grid-cols-4  gap-4 p-4'>
    {/*total Bookings*/}
    <div className='bg-blue-600 w-50 md:w-auto p-4 text-center rounded-2xl'>
    <h1 className='text-white font-bold'>Total Bookings</h1>
    <p>{stats.toal}</p>
    </div>
    {/*Pending*/}
    <div className='bg-yellow-600 w-50 md:w-auto p-4 text-center rounded-2xl'>
    <h1 className='text-white font-bold'>Pending</h1>
    <p>{stats.pending}</p>
    </div>
     {/*confrimed*/}
    <div className='bg-green-600 w-50 md:w-auto p-4 text-center rounded-2xl'>
    <h1 className='text-white font-bold'>Confirmed</h1>
    <p>{stats.confirmed}</p>
    </div>
     {/*completed*/}
    <div className='bg-purple-600 w-50 md:w-auto p-4 text-center rounded-2xl'>
    <h1 className='text-white font-bold'>Completed</h1>
    <p>{stats.completed}</p>
    </div>
    </div>
    <div className='bg-gray-200 rounded-2xl '>
    <div className='flex flex-col md-flex-row  p-5 mb-5 gap-6'>
    {/* Booking Request */}
    <div className='w-full lg:w-1/2 max-h-72  overflow-y-auto pr-1 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-5 border border-gray-100'>
    <h2 className='font-semibold text-xl bold mb-3'>Booking Requests</h2>

    {booking.filter(b => b.status === "pending").map(b=>(
      <div key={b._id} className='border border-gray-100 rounded-xl p-4 mb-3 flex justify-between items-center hover:bg-gray-50 transition'>
        <div >
          <p className='text-md font-medium text-gray-800'>Customer Name: {b.customerId?.name}</p>
          <p className='text-sm text-gray-500'>Service: {b.serviceId?.title}</p>
        </div>
        <div className='flex gap-2 '>
          <button
          onClick={()=>updateStatus(b._id, "confirmed")}
          className='px-3 py-1.5 text-md font-semibold cursor-pointer bg-green-500 text-white rounded-lg hover:bg-green-600 transform hover:scale-103
    transition-transform duration-200 ease-out'>
          Approve
          </button>
          <button 
          onClick={()=> updateStatus(b._id, "cancelled")}
          className='px-3 py-1.5 text-md font-semibold cursor-pointer bg-red-500  text-white rounded-lg hover:bg-red-600 transform hover:scale-103
    transition-transform duration-200 ease-out'>
          Reject
          </button>
        </div>
      </div>
    ))}
    {booking.filter(b => b.status === "pending").length === 0 && (
      <p className='text-sm text-gray-400 text-center py-6'>
        No new booking request
      </p>
    )}
    </div>
  
  {/* My Service Section */}
    <div className='lg:w-1/2 max-h-72 overflow-y-auto pr-1 w-full bg-white rounded-2xl  shadow-sm hover:shadow-md transition-shadow duration-300 p-5 border border-gray-100 md:sticky  md:top-5'>
    <h2 className='font-semibold mb-3 text-xl'>My Services</h2>
    {services.map (s => (
      <div key={s._id} className='border border-gray-100 rounded-xl p-3 mb-3 flex justify-between items-center hover:bg-gray-50 transition'>
        <div>
          <p className='font-medium text-lg'>{s.title}</p>
          <p className='text-sm text-gray-500 '>Rs: {s.price}</p>
        </div>
        <div className='flex gap-2 p-2'>
        <span className='text-md font-semibold px-2 py-1 rounded bg-green-100 text-green-700 '>
          Active
        </span>
        <button onClick={ () => handledeleteService(s._id)} className='text-md px-2 py-1 rounded bg-red-400 text-white font-semibold hover:bg-red-900 transform hover:scale-103
    transition-transform duration-200 ease-out cursor-pointer'>
          Discard
        </button>
        </div>
      </div>
    ))}
    </div>    
    </div>
    <div className='flex flex-col lg:flex-row gap-6 items-stretch'>
    {/* Booking table */}
    <div className='w-full lg:w-1/2 bg-white rounded-xl shadow p-5  flex flex-col m-2 md:m-4'>
    <div>
      <h2 className='bg-white text-xl font-semibold rounded-lg shadow p-4'>My Bookings</h2>
    <div className='mt-3 max-h-105 overflow-y-auto'>
    {booking.length === 0 ? (
      <p className='text-gray-500'>No Bookings yet</p>
    ): (
      <table className='w-full text-left'>
     <thead className='sticky top-0 bg-gray-100 z-10'>
      <tr className='bg-gray-100'>
      <th className='p-3'>Booking Id</th>
      <th className='p-3'>Customer</th>
      <th className='p-3'>Service</th>
      <th className='p-3'>Date</th>
      <th className='p-3'>Status</th>
      <th className='p-3'>Action</th>
      </tr>
     </thead>
     <tbody>
      {booking.map((b)=>{
        return(
        <tr key={b._id} className='border-b'>
          <td className='p-3'>{b._id.slice(0,6)}</td>
          <td className='p-3'>
            <div className='font-semibold'>{b.customerId?.name}</div>
          </td>
          <td className='p-3'>{b.serviceId?.title}</td>
         <td className='p-3'>{new Date(b.createdAt).toLocaleDateString()}</td>
         <td className='p-3'>{b.status}</td>
         <td className='p-3'>
          {b.status === "confirmed" && (
            <div className='flex gap-2'>
            <button 
           onClick={() => updateStatus(b._id, "completed")}
           className='px-2 py-1 bg-green-600 text-white rounded hover:bg-blue-800 cursor-pointer'
           >
            Mark Completed
        </button>
      </div>
      )}
         </td>
        </tr>
        )
      })}
     </tbody>
      </table>
    )}
    </div>
    </div>
    </div>
<div className="w-full md:w-1/2 bg-White rounded-xl shadow p-5 flex flex-col md:h-126 m-2 md:m-4 bg-white">
  <h2 className="text-lg md:text-xl font-semibold mb-3 border-b border-gray-200 pb-2">
    Create New Service
  </h2>
  <form onSubmit={createService} className="flex flex-col gap-8">
    <input
      type="text"
      name="title"
      value={serviceForm.title}
      onChange={handleServiceChange}
      placeholder="Service Title"
      className="p-2 md:p-3 border border-gray-300 rounded-md text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
      required
    />
    <input
      type="text"
      name="description"
      value={serviceForm.description}
      onChange={handleServiceChange}
      placeholder="Description"
      className="p-2 md:p-3 border border-gray-300 rounded-md text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
      required
    />
    <input
      type="number"
      name="price"
      value={serviceForm.price}
      onChange={handleServiceChange}
      placeholder="Price"
      className="p-2 md:p-3 border border-gray-300 rounded-md text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
      required
    />
    <input
      type="text"
      name="duration"
      value={serviceForm.duration}
      onChange={handleServiceChange}
      placeholder="Duration"
      className="p-2 md:p-3 border border-gray-300 rounded-md text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
      required
    />
    <button
      type="submit"
      className="mt-2 md:col-span-2 bg-blue-600 text-white text-sm md:text-base px-4 py-2 rounded-md hover:bg-blue-700 transition-all duration-200"
    >
      Create Service
    </button>
  </form>
</div>

</div>
</div>
    </>
  )
}

export default ProviderDasboard