import express from "express";

import Service from "../models/Service.js";
import User from "../models/User.js";


export const createService = async(req,res) => {
    try{
        //basic validation  
      const { title, description, price, duration} = req.body;
      const providerId = req.user._id;
      if (!title || !description || !price || !duration || !providerId) {
      return res.status(400).json({ msg: "All required fields must be provided" });  
     }

        //check provider exists
        const provider = req.user;
        if(!provider || provider.role !== "provider" || !provider.isApproved){
            return res.status(400).json({msg: "Provider not approved by admin"})
        }

        const service = await Service.create({
            title,
            description,
            price,
            duration,
            providerId: req.user._id
        });
        await service.save();
        res.status(200).json(service);
    }
    catch(error){
     res.status(500).json({msg: error.message});
    }
}
export const getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ providerId: req.user._id });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


export const getService = async(req,res) => {
 
    try{
        const service = await Service.find().populate("providerId", "name email role");
        res.status(200).json(service);
    }
    catch(error){
        res.status(500).json({msg: error.message});
    }
 
}

export const updateService = async(req,res) => {
    try{
        const {id} = req.params;
        const providerId = req.user._id;

        const service = await Service.findById(id);
        if(!service) return res.status(404).json({msg: "Service not found"});

        //only provider who created the service should allow to update
        if(service.providerId.toString() != providerId.toString()){
            return res.status(403).json({msg: "You can only update your service"})
        }
        const updateservice = await Service.findByIdAndUpdate(id, req.body, {new: true});
        res.status(200).json(updateservice);
    }
    catch(error){
        res.status(500).json({msg: error.message});
    }
}
export const deleteService = async (req,res) =>{
    try{
        const {id} = req.params;
        const providerId = req.user._id;

        const service = await Service.findById(id);
        if(!service) return res.status(404).json({msg: "Service not found"});

        if(service.providerId.toString() != providerId.toString()){
            return res.status(403).json({msg: "You can only delete your own service"});
        }
        await Service.findByIdAndDelete(id);
        res.status(200).json({msg: "Service deleted Successfully"});
    }
    catch(error){
        res.status(500).json({msg: error.message});
    }
}

export const getServiceById = async(req,res) =>{
    try{
      const service = await Service.findById(req.params.id).populate("providerId", "name email role");
      if(!service) return res.status(404).json({msg: "Service not found"});
      res.status(200).json(service);
    }
    catch(error){
      res.status(500).json({msg: error.message});
    }
}