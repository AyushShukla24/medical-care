import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: Number 
  },
  photo: { 
    type: String 
  },
  role: {
    type: String,
    enum: ["patient", "admin"],
    default: "patient",
  },
  gender: { 
    type: String, 
    enum: ["male", "female", "other"] 
  },
  bloodType: { 
    type: String 
  },
  is_verified:{
    type:Boolean,
    default:false
  },
  appointments: [{ 
    type: mongoose.Types.ObjectId, 
    ref: "Appointment" 
  }],
  contactUsDetails:[{
    type:mongoose.Types.ObjectId,
    ref:"ContactUs"
  }]
});

export default mongoose.model("User", UserSchema);
