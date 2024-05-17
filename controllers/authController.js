import UserSchema from "../models/UserSchema.js"
import DoctorSchema from "../models/DoctorSchema.js"
import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer';
dotenv.config()


const generateToken=(user)=>{
    return jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET_KEY,{
        expiresIn:'15d',
    })
}

const sendVerifyMail=async(name,email,id)=>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });
    
    try { 
        await transporter.sendMail({
            from: 'Medical Care',
            to: email,
            subject: 'Profile Verification',
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
                    <h2 style="color: #333;">Hi ${name},</h2>
                    <p style="color: #333;">Please click the button below to verify your email address:</p>
                    <a href="http://localhost:5000/api/v1/auth/verify?id=${id}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Verify Email</a>
                </div>
            `,
        });
        console.log('Email sent successfully', id);
    } catch (error) {
        console.error('Error sending email:', error);
    }
    
    
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

        sendVerifyMail(user.name,user.email,user._id);
        console.log(user._id)
        res.status(200).json({success:true,message:'Verify your mail'})
    }
    catch(error){
        res.status(500).json({success:false,message:'Internal server error, Try again'})
    }
}

export const verification = async (req, res) => {
    try {
        const update = await UserSchema.updateOne({ _id: req.query.id }, { $set: { is_verified: true } });
        const htmlResponse = `
            <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f5f5f5;
                            padding: 20px;
                        }
                        .success {
                            color: green;
                        }
                        .error {
                            color: red;
                        }
                    </style>
                </head>
                <body>
                    <h1 class="success">Your email has been verified successfully</h1>
                </body>
            </html>
        `;
        res.send(htmlResponse);
    } 
    catch(error) {
        const htmlError = `
            <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f5f5f5;
                            padding: 20px;
                        }
                        .error {
                            color: red;
                        }
                    </style>
                </head>
                <body>
                    <h1 class="error">Unable to verify email</h1>
                </body>
            </html>
        `;
        res.status(500).send(htmlError);
    }
}


// const generateToken=(user)=>{
//     return jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET_KEY,{
//         expiresIn:'15d',
//     })
// }

// export const register=async(req,res)=>{
//     const {email,password,name,role,photo,gender} =req.body

//     try{
//         let user=null
//         if(role==='patient'){
//             user=await UserSchema.findOne({email})
//         }
//         else if(role==='doctor'){
//             user=await DoctorSchema.findOne({email})
//         }

//         //check user if already exist
//         if(user){
//             return res.status(400).json({message:'User already exist'})
//         }

//         //hash passcode
//         const salt=await bcrypt.genSalt(10);
//         const hashPassword=await bcrypt.hash(password,salt);

//         if(role==='patient'){
//             user=new UserSchema({
//                 name,
//                 email,
//                 password:hashPassword,
//                 photo,
//                 gender,
//                 role
//             })
//         }
//         if(role==='doctor'){
//             user=new DoctorSchema({
//                 name,
//                 email,
//                 password:hashPassword,
//                 photo,
//                 gender,
//                 role
//             })
//         }
//         await user.save();


//         res.status(200).json({success:true,message:'User successfully created'})
//     }
//     catch(error){
//         res.status(500).json({success:false,message:'Internal server error, Try again'})
//     }
// }


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
        
            if(!user.is_verified){
                return res.status(404).json({message:'Verify your mail'})
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