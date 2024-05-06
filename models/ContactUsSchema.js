import mongoose from "mongoose"

const ContactUsSchema=mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    }
})

export default mongoose.model("ContactUs",ContactUsSchema)