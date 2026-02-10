import express from "express";

import { createBooking, updateBookingStatus, deleteBooking, getbooking, getMyBooking,  getbookingById, updateBooking } from "../controllers/bookingController.js";
import { authenticateUser } from "../controllers/userController.js";
import { getbookingForProvider } from "../controllers/bookingController.js";
import{authenticateToken} from "../middleware/authToken.js";
import{allowRoles} from "../middleware/roleMiddleware.js";
const router = express.Router();


router.post("/", authenticateToken,allowRoles("customer")  ,createBooking);
router.put("/:id", authenticateToken, allowRoles("customer" , "provider"), updateBooking)
router.delete("/:id", authenticateToken, allowRoles("customer", "admin"), deleteBooking)
router.get("/",authenticateToken, allowRoles("customer", "provider", "admin"),  getbooking);
//bookings for specific provider
router.get("/provider/me", authenticateToken, allowRoles("provider"), getbookingForProvider)
//booking for specific customer
router.get("/customer/me", authenticateToken, allowRoles ("customer"), getMyBooking);
router.get("/:id", authenticateToken, allowRoles("customer", "provider", "admin") ,getbookingById);
router.put("/status/:id", authenticateToken, updateBookingStatus);
export default router;


