import jwt from "jsonwebtoken"
import DoctorSchema from "../models/DoctorSchema.js";
import UserSchema from "../models/UserSchema.js";
import Sendmail from "./nodeMailer.js";

export const authenticate=async(req,res,next)=>{
    const authToken=req.headers.authorization

    // console.log(authToken)
  
    if(!authToken || !authToken.startsWith("Bearer ")){
        return res.status(401).json({success:false,message:'No token, authorization denied'})
    }
    
    try{
        const token=authToken.split(" ")[1]
        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)


        req.userId=decoded.id
        req.role=decoded.role

        next();

    }
    catch(error){
        if(error.name==='TokenExpiredError'){
            return res.status(401).json({message:'Token is expired'})
        }
        // console.log(error)
        return res.status(401).json({success:false,message:error})

    }
}

export const restrict=(roles)=>async(req,res,next)=>{
    const userId=req.userId

    let user=null

    const patient=await UserSchema.findById(userId)
    const doctor=await DoctorSchema.findById(userId)

    if(patient){
        user=patient
    }
    if(doctor){
        user=doctor
    }
    
    // console.log(user.role)
    if(!roles.includes(user.role)){
        return res.status(401).json({success:false,message:"You're not authorized"})
    }
    next();
}