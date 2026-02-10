import { useState } from "react";
import api from "../api/axios";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
export default function RegisterLogin() {
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "", role: "customer" });
  const[isRegistered, setIsRegistered] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  //Register User Method
  const handleRegister = async (e) => {
  e.preventDefault();
    try {
      const res = await api.post("/api/user/register", registerData);
      setMessage(`Registration Successful: ${res.data.name}`);
      setIsRegistered(true);
    } catch (err) {
      setMessage(`Registration Error: ${err.response?.data?.msg || err.message}`);
    }
  };
 //login method
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/user/login", loginData);
      if (res.data.user.role === "customer") {
      sessionStorage.setItem("customerToken", res.data.accessToken);
    } else if (res.data.user.role === "provider") {
      sessionStorage.setItem("providerToken", res.data.accessToken);
    } else if (res.data.user.role === "admin") {
      sessionStorage.setItem("adminToken", res.data.accessToken);
    }
      dispatch(
        loginSuccess({
          user: res.data.user,
          token: res.data.accessToken,
        }),
     
      );
      //navigate based on roles
      if (res.data.user.role === "provider") {
        navigate("/service");
      }
      if(res.data.user.role === "customer"){
        navigate("/booking")
      }
      if(res.data.user.role === "admin"){
        navigate("/admin")
      }
      setMessage(`Login Successful: Welcome ${res.data.user.name}`);
    } catch (err) {
      setMessage(`Login Error: ${err.response?.data || err.message}`);
    }
  };
  //logout method
  const handleLogout = () => {
  if (users.role === "customer") sessionStorage.removeItem("customerToken");
  if (users.role === "provider") sessionStorage.removeItem("providerToken");
  if (users.role === "admin") sessionStorage.removeItem("adminToken");

  dispatch(logout());
  navigate("/");
};

  return (
   
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-5">
      <div className="w-full max-w-md bg-yellow-300 shadow-md rounded-lg p-6">
         {!isRegistered && (
    <>
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <form onSubmit={handleRegister} className="space-y-3">
          <input
            type="text"
            placeholder="Name"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={registerData.name}
            onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={registerData.email}
            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={registerData.password}
            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
            required
          />
          <select
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={registerData.role}
            onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
          >
            <option value="customer">Customer</option>
            <option value="provider">Provider</option>
          </select>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
            Register
          </button>
        </form>
        <p className="text-center text-md  mt-2 ">
            Already have an account?{" "}
        <span
        className="text-blue-600 cursor-pointer hover:underline"
      onClick={() => setIsRegistered(true)}
     >
       Login
      </span>
      </p>
  </>
)}
 {isRegistered && (
  <>
        <h2 className="text-2xl font-bold mt-6 mb-4 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            required
          />
          <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition">
            Login
          </button>
        </form>
        
       {message && (
  <p className="mt-4 text-center text-sm font-medium text-green-700">
    {message}
  </p>
)}
</>
)}
      </div>
    </div>
  );
}
