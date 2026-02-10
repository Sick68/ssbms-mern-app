import React, { useEffect,useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../features/auth/authSlice';
import api from '../api/axios';

function AdminDasboard() {
    const {user, isAuthenticated} = useSelector(state => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const[stats, setStats] = useState([]);
    const[users, setUser] = useState([]);
    const[booking, setBookings] = useState([]);
    const[search , setSearch] = useState("");
    const[providers, setProviders] = useState([]);
    
    useEffect(() => {
        if(isAuthenticated){
            fetchData();
        }
    },[isAuthenticated]); 

    //method to fetch data
    const fetchData = async () => {
        try{
        //fetching user
        const userRes = await api.get("api/user");
        setUser(userRes.data);
        
        //fetching booking data
        const bookingRes = await api.get("api/booking");
        setBookings(bookingRes.data);

        //fetching pending provider that were not yet been approve
        const providerRes = userRes.data.filter(u => u.role === "provider" && !u.isApproved);
        setProviders(providerRes);

        setStats({
            totalUsers: userRes.data.length,
            totalProviders: userRes.data.filter(u => u.role === "provider").length,
            totalCustomers: userRes.data.filter(u => u.role === "customer").length,
            totalPendingApprovals: providerRes.length,
            totalBookings: bookingRes.data.length
        })
    }catch(error){
      console.error("Admin fetch error: ", error.message);
        }
    }
    //method for logout    
    const handleLogout = () => {
     dispatch(logout());
     navigate("/");
    }

    //method for pending providers
    const handleApprovedProvider = async (id) => {
        try{
            const res = await api.put(`/api/user/approve-provider/${id}`)
            fetchData();
        }catch(error){
            console.error(error);
        }
    } 
    //method for toggling a user as active or not
    const handleToggleUser = async (id) => {
      try{
        await api.put(`api/user/toggle-active/${id}`);
        fetchData();
      }catch(error){
        console.error(error);
      }
    }
 
    if(!isAuthenticated) return <p>Please Login as Admin</p>;
    if(!user) return <p>Loading user...</p>;
    return (
        <>


  <div className='bg-gray-100'
    >

    {/*Header */}
    <div className='bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b border-gray-100 '>
      <h1 className='text-2xl font-bold'>Admin Dashboard</h1>
      <div className='flex items-center gap-4'>
        <span className='text-gray-600'>Hello, {user.name}</span>
      <button onClick={handleLogout} className='px-4 py-2 bg-red-500 text-white rounded-lg cursor-pointer  hover:bg-red-900'>
        Logout
      </button>
      </div>
    </div>
    </div>
 {/*Stats*/}
     <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4  p-5'>
          {/*total Users*/}
        <div className='bg-blue-600 w-50 p-4  text-center rounded-2xl '>
            <h2 className='text-white font-bold'>Total Users</h2>
            <p className='font-semibold text-white text-2xl'>{stats.totalUsers}</p>
        </div>
           <div className='bg-green-600  w-50 p-4 text-center rounded-2xl'>
            <h2 className='text-white font-bold'>Providers</h2>
            <p className='font-semibold text-white text-2xl'>{stats.totalProviders}</p>
        </div>

        <div className='bg-yellow-500 w-50 p-4   text-center rounded-2xl '>
            <h2 className= " text-white font-bold">Pending Approval</h2>
            <p className='font-semibold text-white text-2xl'>{stats.totalPendingApprovals}</p>
                 </div>
        <div className='bg-orange-400 w-50 p-4  text-center rounded-2xl  '>
            <h2 className= " font-bold text-white" >Total Customer</h2>
            <p className='font-semibold text-white text-2xl'>{stats.totalCustomers}</p>
        </div>
        <div className='bg-purple-600 w-50 p-4  text-center rounded-2xl  '>
        <h2 className= " font-bold text-white text-lg" >Total Bookings</h2>
        <p className='font-semibold text-white text-2xl'>{stats.totalBookings}</p>
        </div>
     </div>
      {/*Pending Provider Approval*/}
     <div className=' flex flex-col lg:flex-row gap-6 p-4'>
        <div className='max-h-96 overflow-y-auto flex-1 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-5 border border-gray-100'>
            <h2 className='text-xl font-bold mb-3 border-b border-gray-200 pb-2  '>Pending Approval</h2>
        
            {providers.length === 0 ? (
                <p>No Penidng Provider</p>
            ):(
                <table className='w-full text-left'>
                    <thead>
                        <tr className='bg-gray-200 '>
                            <th className='p-2 '>Name</th>
                            <th className='p-2 '>Email</th>
                            <th className='p-2 '>Action</th>
                        </tr>
                    </thead>
            <tbody>
            
            {providers.map(p=> (
            <tr key = {p._id}>
             
             <td className='p-2  text-left text-lg'>{p.name}</td>
             <td className='p-2  text-left text-lg'>{p.email}</td>
             <td className='p-2  text-left text-lg'>
                <button 
                onClick={()=> handleApprovedProvider(p._id)}
                className='px-2 py1 bg-green-500 text-white rounded font-semibold hover:bg-green-800'>
                    Approve
                </button>
            </td>
           </tr>
            ))}
         </tbody>
         </table>
            )}
        </div>
        {/* All Users Section */}
<div className="flex-1 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-5 border border-gray-100">
  <div className='flex-1 gap-2 items-center'>
  <h2 className="text-xl font-bold mb-3">All Users</h2>
  <div className="mb-4">
  <input
    type="text"
    placeholder="Search users..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full p-2 border border-gray-300 rounded-lg"
  />
</div>
</div>
  {users.length === 0 ? (
    <p>No users yet</p>
  ) : (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {users.filter( u =>  
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) 
      )
      .slice(0,4)
      .map( u => (
      
        <div
          key={u._id}
          className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-white hover:bg-gray-50 transition"
        >
          {/* User info */}
          <div className="flex items-center gap-4">
            {/* Placeholder Avatar */}
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
              {u.name?.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{u.name}</p>
              <p className="text-sm text-gray-500">{u.email}</p>
            </div>
          </div>

          {/* Status / Role Badge */}
          <div className='flex items-center gap-2'>
            {u.role === "customer" && (
              <span className="px-3 py-1 text-sm bg-gray-400 text-white rounded-full">
                Customer
              </span>
            )}
            {u.role === "provider" && !u.isApproved && (
              <span className="px-3 py-1 text-sm bg-orange-500 text-white rounded-full">
                Pending
              </span>
            )}
            {u.role === "provider" && u.isApproved && (
              <span className="px-3 py-1 text-sm bg-green-500 text-white rounded-full">
                Provider
              </span>
            )}
          
          {u.isActive === false && (
            <span className='px-3 py-1 text-sm bg-red-500 text-white rounded-full ml-2'></span>
          )}
          <div className='flex gap-2'>
          <button
          onClick={()=> handleToggleUser(u._id)}
          className={`px-3 py-1 text-white rounded-lg hover:opacity-80 bg- ${
            u.isActive ? "bg-red-500 hover:bg-red-900": "bg-green-500  hover:bg-green-900"
          }`}>
        {u.isActive ? "Block" : "Unblock"}
          </button>
           
          </div>
        </div>
        </div>
      ))}
    </div>
  )}
</div>
      </div>
       
  
     {/*Recent Booking Section for Admin */}
     <div className='p-4'>
     <div className='w-full  bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-100'>
       <h2 className='text-xl font-bold mb-3 border-b-2 inline-block '>Recent Bookings</h2>
       {booking.length === 0 ? (
        <p>No bookings yet</p>
       ):(
        <div className='max-h-96 overflow-y-auto'>
        <table className='w-full text-left'>
        <thead> 
        <tr className='bg-gray-100 text-gray-700 sticky top-0 z-10'>
        <th className='p-2 '>Booking Id</th>
        <th  className='p-2 ' >Customer</th>
        <th  className='p-2 '>Service</th>
        <th  className='p-2 '>Date</th>
        <th  className='p-2 '>Status</th>
        </tr>
        </thead>
        <tbody>
            {booking.map(b => (
                <tr key={b._id}>
                    <td className='p-2 text-left'>{b._id.slice(0,6)}</td>
                    <td className='p-2 text-left'>{b.customerId?.name}</td>
                    <td className='p-2 text-left'>{b.serviceId?.title}</td>
                    <td className='p-2 text-left'>{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">
                   <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
                   b.status === "pending" ? "bg-yellow-500" : "bg-green-500"
        }`}>
     {b.status}
          </span>
        </td>
     </tr>
            ))}
        </tbody>
        </table>
       </div>
       )}
     </div>
     </div>
     

  </>
  
  )
}

export default AdminDasboard