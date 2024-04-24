const Router = require("express");
const Booking = require("../models/bookingSchema");
const Joi = require("joi");

const bookingRouter = Router();

bookingRouter.post("/", async (req, res) => {
  try {
    const existBooking = await Booking.findone({ user_id, space_id });

    if (existBooking) {
      return res.status(400).json({ error: "space is already booked" });
    } else {
      const booking = await Booking.create({
        vehicle_company,
        vehicle_model,
        plate_number,
        car_color,
        confirm_booking,
        space_id,
        user_id,
        confirm_booking,
      });
      res.json({ message: "Booked", booking });
    }
  } catch (error) {
    console.error("error-", error);
    res.status(400).json({ error });
  }
});
