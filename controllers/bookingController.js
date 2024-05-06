import UserSchema from "../models/UserSchema.js";
import DoctorSchema from "../models/DoctorSchema.js";
import BookingSchema from "../models/BookingSchema.js";
import Stripe from "stripe";
import dotenv from 'dotenv'
import sendmail from "../authentication/nodeMailer.js";
dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

export const getCheckoutSession = async (req, res) => {
  try {
    const doctor = await DoctorSchema.findById(req.params.doctorId);
    const user = await UserSchema.findById(req.userId);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.CLIENT_SITE_URL}`,
      cancel_url: `${req.protocol}://${req.get("host")}/doctors/${doctor.id}`,
      customer_email: user.email,
      client_reference_id: req.params.doctorId,
      line_items: [
        {
          price_data: {
            currency: "INR",
            unit_amount: doctor.ticketPrice * 100,
            product_data: {
              name: doctor.name,
              description: doctor.bio,
              images: [doctor.photo],
            },
          },
          quantity: 1,
        },
      ],
    });

    const booking = new BookingSchema({
      doctor: doctor._id,
      user: user._id,
      ticketPrice: doctor.ticketPrice,
      session: session.id,
    });

    await booking.save();
    sendmail(user.email);

    res.status(200).json({ success: true, message: "Successfully paid", session });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating checkout session" });
  }
};
