import DoctorSchema from "../models/DoctorSchema.js";
import BookingSchema from "../models/BookingSchema.js";

export const updatedoctor=async(req,res)=>{
    const id=req.params.id;

    try{
        const result =await DoctorSchema.findByIdAndUpdate(id,{$set:req.body},{new:true})
        res.status(200).json({sucess:true,message:'Successfully updated',data:result})
    }
    catch(error){
        console.log(error)
        res.status(500).json({sucess:false,message:'failed to updated'})
    }
}

export const deletedoctor=async(req,res)=>{
    const id=req.params.id;
    console.log("here")

    try{
        const deleteddoctor =await DoctorSchema.findByIdAndDelete(id)
        res.status(200).json({sucess:true,message:'Successfully deleted'})
    }
    catch(error){
        res.status(500).json({sucess:false,message:'failed to delete'})
    }
}

export const getSingledoctor=async(req,res)=>{
    const id=req.params.id;

    console.log(id)

    try{
        const doctor =await DoctorSchema.findById(id).populate('reviews').select('-password')
        res.status(200).json({sucess:true,message:'doctor found',data:doctor})
    }
    catch(error){
        res.status(404).json({sucess:false,message:'no doctor found'})
    }
}

export const getAlldoctor = async (req, res) => {
    try {
        const { query } = req.query;

        let doctors;

        //properly filter doctors based on the search query
        if (query) {
            doctors = await DoctorSchema.find({
                isApproved: 'approved',
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { specialization: { $regex: query, $options: 'i' } },
                ],
            }).select('-password');
        } else {
            doctors = await DoctorSchema.find({ isApproved: 'approved' }).select('-password');
        }

        res.status(200).json({ success: true, message: 'Doctors found', data: doctors });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


export const getDoctorProfile=async(req,res)=>{
    const doctorId=req.userId

    try{
        const doctor=await DoctorSchema.findById(doctorId)

        if(!doctor){
            return res.status(404).json({sucess:false,message:"Doctor not found"})
        }

        const {password,...rest}=doctor._doc
        const appointments=await BookingSchema.find({doctor:doctorId})

        res.status(200).json({
            sucess:true,
            message:'Profile info is getting',
            data:{...rest,appointments}
        })
    }
    catch(err){
        res.status(200).json({sucess:false,message:"Something went wrong, cannot get"})
    }
}