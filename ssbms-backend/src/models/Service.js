import mongoose from "mongoose";

const ServiceSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        description: true
    },
    price: {
     type: Number,
     required: true
    },
    duration:{
        type: Number,
        required: true
    },
    providerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, {timestamps: true});

export default mongoose.model("Service", ServiceSchema);