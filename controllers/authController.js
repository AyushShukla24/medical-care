import UserSchema from "../models/UserSchema.js"
import DoctorSchema from "../models/DoctorSchema.js"
import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
dotenv.config()


const generateToken=(user)=>{
    return jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET_KEY,{
        expiresIn:'15d',
    })
}

export const register=async(req,res)=>{
    const {email,password,name,role,photo,gender} =req.body

    try{
        let user=null
        if(role==='patient'){
            user=await UserSchema.findOne({email})
        }
        else if(role==='doctor'){
            user=await DoctorSchema.findOne({email})
        }

        //check user if already exist
        if(user){
            return res.status(400).json({message:'User already exist'})
        }

        //hash passcode
        const salt=await bcrypt.genSalt(10);
        const hashPassword=await bcrypt.hash(password,salt);

        if(role==='patient'){
            user=new UserSchema({
                name,
                email,
                password:hashPassword,
                photo,
                gender,
                role
            })
        }
        if(role==='doctor'){
            user=new DoctorSchema({
                name,
                email,
                password:hashPassword,
                photo,
                gender,
                role
            })
        }
        await user.save();
        res.status(200).json({success:true,message:'User successfully created'})
    }
    catch(error){
        res.status(500).json({success:false,message:'Internal server error, Try again'})
    }
}

export const login=async(req,res)=>{
        const {email,password}=req.body;

        try{
            let user=null

            const patient=await UserSchema.findOne({email})
            const doctor=await DoctorSchema.findOne({email})

            
            if(patient){
                user=patient
            }
            if(doctor){
                user=doctor
            }

            if(!user){
                return res.status(404).json({message:'User not found'})
            }

            const isPasswordMatch=await bcrypt.compare(password,user.password);


            if(!isPasswordMatch){
                return res.status(400).json({status:false,message:"Invaild credentials"})
            }

            const token=generateToken(user);
            
            const {role,appointments,...rest}=user._doc
            
            res.status(200).json({status:true,message:'Successfully login',token,data:{...rest},role})
        }
        catch(error){
            res.status(500).json({status:false,message:'failed to login'})
        }
}