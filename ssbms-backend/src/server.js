import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import user_route from "./routes/user.js";
import service_route from "./routes/serviceRout.js";
import booking_route from "./routes/bookingRoute.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req,res)=>{
    res.send("SSBMS API is running")
});

//middleware to set user router
app.use("/api/user", user_route);

//middleware to set service router
app.use("/api/service", service_route);

//middleware to set booking router
app.use("/api/booking", booking_route);

// CORS configuration
app.use(cors({
  origin: "https://ssbms-mern-app-trrd.vercel.app/,http://localhost:5173", // replace with your actual Vercel frontend URL
  credentials: true
}));


const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

