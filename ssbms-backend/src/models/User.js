import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "email must be provided"],
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "password must be provided"]
    },
    role: {
        type: String,
        enum: ["customer", "provider", "admin"],
        default: "customer"
    },
    createdAt: {
    type: Date,
    default: Date.now
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
   }

},{timestamps: true});

const User = mongoose.model("User", UserSchema);
export default User;