import ReviewSchema from '../models/ReviewSchema.js'
import DoctorSchema from '../models/DoctorSchema.js'

export const getAllReviews=async(req,res)=>{
    try{
        console.log("lol")
        const reviews=await ReviewSchema.find({});

        res.status(200).json({success:true,message:'Successfull',data:reviews})
    }
    catch(error){
        res.status(501).json({success:false,message:'Not found'})
    }
}

export const createReview=async(req,res)=>{
    if(!req.body.doctor) req.body.doctor=req.params.doctorId
    if(!req.body.user) req.body.user=req.params.user

    const newReview=new ReviewSchema(req.body)

    try{
        const savedReview=await newReview.save();

        await DoctorSchema.findByIdAndUpdate(req.body.doctor,{
            $push:{review:savedReview._id},
        })

        res.status(200).json({success:true,message:'Review submitted',data:savedReview})
    }
    catch(error){
        res.status(500).json({success:false,message:error.message})
    }
}