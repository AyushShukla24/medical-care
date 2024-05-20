import UserSchema from "../models/UserSchema.js";
import BookingSchema from '../models/BookingSchema.js'
import DoctorSchema from "../models/DoctorSchema.js"
import bcrypt from 'bcrypt'
import ContactUsSchema from "../models/ContactUsSchema.js";
import ReviewSchema from "../models/ReviewSchema.js";

export const updateUser=async(req,res)=>{
    const id=req.params.id;
    const {password,...rest}=req.body

    if(password){
        const salt=await bcrypt.genSalt(10)
        const hashPassword=await bcrypt.hash(password,salt)
        rest.password = hashPassword
    }

    try{
        const updatedUser =await UserSchema.findByIdAndUpdate(id,{$set:rest},{new:true})
        res.status(200).json({sucess:true,message:'Successfully updated',data:updateUser})
    }
    catch(error){
        res.status(500).json({sucess:false,message:'failed to updated'})
    }
}

export const deleteUser=async(req,res)=>{
    const id=req.params.id;
    
    try{
        const user=await UserSchema.findById(id)

        if(!user){
            res.status(404).json({sucess:false,message:'User not found'})
        }

        await ContactUsSchema.deleteMany({ user:user._id });
        await ReviewSchema.deleteMany({ user: user._id });
        await BookingSchema.deleteMany({user:user._id})
        await UserSchema.findByIdAndDelete(id);
        res.status(200).json({sucess:true,message:'Successfully deleted'})
    }
    catch(error){
        res.status(500).json({sucess:false,message:'failed to delete'})
    }
}

export const getSingleUser=async(req,res)=>{
    const id=req.params.id;

    try{
        const user =await UserSchema.findById(id).select('-password')
        res.status(200).json({sucess:true,message:'user found',data:user})
    }
    catch(error){
        res.status(404).json({sucess:false,message:'no user found'})
    }
}


export const getAllUser=async(req,res)=>{

    try{
        const users =await UserSchema.find({}).select('-password')
        res.status(200).json({sucess:true,message:'users found',data:users})
    }
    catch(error){
        res.status(404).json({sucess:false,message:'not found'})
    }
}

export const getUserProfile=async(req,res)=>{
    const userId=req.userId;

    try{
        const user=await UserSchema.findById(userId)

        if(!user){
            return res.status(404).json({sucess:false,message:'User not found'})
        }

        const {password,...rest}=user._doc


        res.status(200).json({sucess:true,message:'Profile info is getting',data:{...rest}})
    }
    catch(err){
        res.status(500).json({sucess:false,message:"Something went wrong, cannot get"})
    }
}

export const getMyAppointments = async (req, res) => {
    try {
        const bookings = await BookingSchema.find({ user: req.userId });
        const doctorIds = bookings.map((booking) => booking.doctor);

        const doctors = await DoctorSchema.find({ _id: { $in: doctorIds } }).select("-password");

        res.status(200).json({
            success: true,
            message: 'Appointments retrieved successfully',
            data: doctors
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve appointments'
        });
    }
};
