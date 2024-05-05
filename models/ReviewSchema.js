import mongoose from "mongoose";
import DoctorSchema from "./DoctorSchema.js";

const reviewSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/,function (next){
  this.populate({
    path:'user',
    select:"name photo",
  })
  next()
})

reviewSchema.statics.calcAverageRatings=async function(doctorId){
  const stats=await this.aggregate([
    {
      $match:{doctor:doctorId},
    },
    {
    $group:{
      _id:"$doctor",
      numOfRating:{$sum:1},
      avgRating:{$avg:"$rating"},
    }
  }
  ])

  await DoctorSchema.findByIdAndUpdate(doctorId,{
    totalRating:stats[0].numOfRating,
    averageRating:stats[0].avgRating
  })
}


reviewSchema.post('save',function(){
  this.constructor.calcAverageRatings(this.doctor)
})

export default mongoose.model("Review", reviewSchema);


// import mongoose from "mongoose";
// import DoctorSchema from "./DoctorSchema.js";

// const reviewSchema = new mongoose.Schema(
//   {
//     doctor: {
//       type: mongoose.Types.ObjectId,
//       ref: "Doctor",
//       required: true, // Ensure a doctor is always associated with a review
//     },
//     user: {
//       type: mongoose.Types.ObjectId,
//       ref: 'User', // Assuming there's a User model to reference
//       required: true, // Ensure a user is always associated with a review
//     },
//     reviewText: {
//       type: String,
//       required: true,
//     },
//     rating: {
//       type: Number,
//       required: true,
//       min: 0,
//       max: 5,
//       default: 0,
//     },
//   },
//   { timestamps: true }
// );

// reviewSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'user',
//     select: "name photo",
//   });
//   next();
// });

// reviewSchema.statics.calcAverageRatings = async function (doctorId) {
//   const stats = await this.aggregate([
//     {
//       $match: { doctor: doctorId },
//     },
//     {
//       $group: {
//         _id: "$doctor",
//         numOfRating: { $sum: 1 },
//         avgRating: { $avg: "$rating" },
//       },
//     },
//   ]);

//   // Ensure stats[0] exists before updating DoctorSchema
//   if (stats.length > 0) {
//     await DoctorSchema.findByIdAndUpdate(doctorId, {
//       totalRating: stats[0].numOfRating,
//       averageRating: stats[0].avgRating,
//     });
//   }
// };

// reviewSchema.post('save', function () {
//   // Use `this` to reference the saved document
//   this.constructor.calcAverageRatings(this.doctor);
// });

// export default mongoose.model("Review", reviewSchema);

