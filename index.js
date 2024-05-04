import express from 'express'
import cookiePraser from 'cookie-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authRoute from "./router/auth.js";
import userRoute from "./router/user.js";
import doctorRoute from "./router/doctor.js";
import reviewRoute from "./router/review.js";
import bookingRoute from './router/booking.js';


dotenv.config()

const app=express();
const port=process.env.PORT || 4000;


app.use(express.json())
app.use(cookiePraser())
app.use(cors())
app.use('/api/v1/auth',authRoute)
app.use('/api/v1/users',userRoute)
app.use('/api/v1/doctors',doctorRoute)
app.use('/api/v1/reviews',reviewRoute)
app.use('/api/v1/bookings',bookingRoute)

app.get('/',(req,res)=>{
    res.send(`api is working`)
})

mongoose.set('strictQuery',false)
const db_connect=async()=>{
    try{
        await mongoose.connect(
            process.env.MONGO_URL,{
                useNewUrlParser:true,
                useUnifiedTopology:true
            }
        )

        console.log("DB is connected successfully")
    }
    catch(error){
        console.log("DB is not connected "+error)
    }
}


app.listen(port,()=>{
    db_connect();
    console.log(`server is running at port: ${port}`)
})