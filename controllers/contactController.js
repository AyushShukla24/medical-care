import ContactUsSchema from "../models/ContactUsSchema.js"
import UserSchema from "../models/UserSchema.js"


export const contactUs=async(req,res)=>{
    req.body.user=req.userId
    const{email,subject,message,user}=req.body

    try{ 
        const user=await UserSchema.findOne({email});
        
        if(user){
            const data=new ContactUsSchema({
                email,
                subject,
                message,
                user
            })
    
            const result=await data.save();

            await UserSchema.findByIdAndUpdate(user._id,{
                $push:{contactUsDetails:result._id}
            });
        }
        else{
            return  res.status(500).json({success:false,message:'Try with registred email'})
        }

        res.status(200).json({success:true,message:'Successfully submited'})
    }
    catch(error){
        res.status(500).json({success:false,message:'Internal Server Error'})
    }
}