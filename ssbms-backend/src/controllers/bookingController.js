import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Service from "../models/Service.js";


export const createBooking = async(req,res) =>{
    try{
        const { serviceId, providerId, date} = req.body;
        const customerId = req.user._id;
        

        if(!customerId || !serviceId || !providerId || !date){
           return res.status(400).json({msg: "All fields must be provided"});
        }
        
        //check customer exists
        const customer = await User.findById(customerId);
        if(!customer || customer.role !== "customer"){
           return res.status(400).json({msg: "Invalid Customer Id"});
        }
        //check provider exist
        const provider = await User.findById(providerId);
        if(!providerId || provider.role !== "provider"){
            return res.status(400).json({msg: "Invalid provider Id"});
        }
       //check service exist
               if (!serviceId || !date) {
            return res.status(400).json({ msg: "Service and date must be provided" });
        }

       const service = await Service.findById(serviceId);
       if(!service){
            return res.status(400).json({msg: "Invalid service Id"});
        }
     //creat Booking after checking all above criteria   
     const booking = await Booking.create({
        customerId,
        providerId,
        serviceId,
        date,
        status:"pending",
     });
     res.status(200).json(booking);


    }catch(error){
          res.status(500).json({msg: error.message});
    }
}
export const updateBooking = async(req,res) => {
    try{

        const{id} = req.params;
        const user = req.user; // logged in User

        const booking = await Booking.findById(id);
        if(!booking) return res.status(404).json({msg: "Booking not found"});

        if(booking.customerId.toString() != req.user._id.toString()){
            return res.status(403).json({msg: "You can only update your booking"});
        }
        
        const customer = await User.findById(customerId);
if(!customer || customer.role !== "customer"){
    return res.status(400).json({ msg: "Invalid customer" });
}

    const updatebooking = await Booking.findByIdAndUpdate(id, req.body, {new: true});
    return res.status(200).json({msg: "Booking updated Successfully", booking: updatebooking});
    }
    catch(error){
        return res.status(500).json({msg: error.message});
    }
}

export const updateBookingStatus = async(req,res,next) => {
    try{
        const {id} = req.params;
        const {status} = req.body;
        const user = req.user;

        //validate status
        const allowedStatuses = ["pending", "confirmed", "completed", "cancelled"];
        if(!allowedStatuses.includes(status)){
    return res.status(400).json({ msg: "Invalid status" });
}

        //find booking
        const booking = await Booking.findById(id);
        if(!booking){
            return res.status(404).json({msg: "Booking not found"})
        }

        if(user.role !== "admin"  &&  user._id.toString() !== booking.providerId.toString() ) {
            return res.status(403).json({msg: "You are not authorized to update the status of booking"})
        }
        booking.status = status;
        await booking.save();

        return res.status(200).json({msg: "Booking status updated", booking});
    }catch(error){
        return res.status(500).json({msg: error.message});
    }
}

export const deleteBooking = async(req,res) => {
    try{

        const{id} = req.params;
        const customerId = req.user._id;

        const booking = await Booking.findById(id);
        if(!booking) return res.status(404).json({msg: "Booking not found"});

        if(booking.customerId.toString() != customerId.toString()){
            return res.status(403).json({msg: "You can only delete your booking"});
        }
        
        const customer = await User.findById(customerId);
if(!customer || customer.role !== "customer"){
    return res.status(400).json({ msg: "Invalid customer" });
}

    const deletebooking = await Booking.findByIdAndDelete(id, req.body, {new: true});
    return res.status(200).json({msg: "Booking deleted Successfully"});
    }
    catch(error){
        return res.status(500).json({msg: error.message});
    }
}

export const getbooking = async(req,res) => {
    try{
       const booking = await Booking.find().populate("providerId", "name email")
                                           .populate("customerId","name email role")
                                           .populate("serviceId", "title description price duration");
       res.status(200).json(booking);
    } catch(error){
        res.status(500).json({msg: error.message});
    }
};

//getting booking for a sepecific customer
export const getMyBooking = async (req,res) => {
    try{ 
     const booking = await Booking.find({customerId: req.user._id})
     .populate("serviceId", "title description price duration")
     .populate("providerId", "name email")
     res.status(200).json(booking);
    }catch(error){
        res.status(500).json({msg: error.message});
    }
}

export const getbookingById = async(req,res) =>{
    try{
        const booking = await Booking.findById(req.params.id)
        .populate("providerId", "name email")
        .populate("customerId","name email role")
        .populate("serviceId", "title description price duration");
        res.status(200).json(booking);
    }
    catch(error){
        res.status(500).json({msg: error.message});
    }
} 

// In bookingController.js
export const getbookingForProvider = async (req, res) => {
  try {
    const user = req.user; // logged-in provider
    const booking = await Booking.find({ providerId: user._id })
      .populate("providerId", "name email")
      .populate("customerId","name email role")
      .populate("serviceId", "title description price duration");

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
