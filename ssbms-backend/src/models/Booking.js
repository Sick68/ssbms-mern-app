import mongoose from "mongoose";


const BookingSchema = mongoose.Schema({
   title: {
   type: String,
   },
 customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref : "User",
    required: true

 },
 serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true
 },
 providerId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
 },
 date: {
    type: Date,
    required: true
 },
 status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending"
 }
}, {timestamps: true});

export default mongoose.model("Booking", BookingSchema);