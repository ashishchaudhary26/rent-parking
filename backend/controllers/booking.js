const Router = require("express");
const Booking = require("../models/bookingSchema");
const { Types } = require("mongoose");
// const Joi = require("joi");

const bookingRouter = Router();

//create booking

bookingRouter.post("/", async (req, res) => {
  try {
    const existBooking = await Booking.findOne({ user_id, space_id });

    if (existBooking) {
      return res.status(400).json({ error: "space is already booked" });
    } else {
      const booking = await Booking.create({
        vehicle_company,
        vehicle_model,
        plate_number,
        car_color,
        // confirm_booking,
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

//get booking list

bookingRouter.get("/", async (req, res) => {
  try {
    const { user_id, owner_id } = req.query;
    if (user_id) {
      const booking = Booking.find({ user_id }).populate({
        path: "space_id",
        populate: { path: "parking_id" },
      });
      return res.json(booking);
    }
    booking = booking
      .find({})
      .populate({ path: "space_id", populate: { path: "parking_id" } });
    if (owner_id) {
      booking = booking.filter((item) =>
        item?.space_id?.parking_id?.user_id.equals(owner_id)
      );
    }
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error });
  }
});

//update booking
bookingRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { confirm_booking } = req.body;

    if (Types.ObjectId.isValid(id)) {
      const booking = await Booking.findById({ _id: id });
      if (!booking) {
        res.status(400).json({ error: "give correct booking id" });
      } else {
        const schema = Joi.object({
          space_id: Joi.string().required(),
          user_id: Joi.string().required(),
          confirm_booking: Joi.string().valid(
            "approved",
            "pending",
            "rejected"
          ),
        });

        let { space_id, user_id } = booking;
        space_id = space_id.toString();
        user_id = user_id.toString();
        const updatedBookingObj = {
          space_id,
          user_id,
          ...req.body,
          confirm_booking,
        };
        const { error } = schema.validate(updatedBookingObj);
        if (error) {
          res.status(400).json({ error: error.details[0].message });
        } else {
          console.log("updatedBookingObj ", updatedBookingObj);
          if (updatedBookingObj?.confirm_booking === "approved") {
            await Booking.updateMany(
              { space_id },
              { $set: { confirm_booking: "rejected" } }
            );
          }
          const updatedBooking = await booking.updateOne(updatedBookingObj);

          if (updatedBooking) {
            res.json({ message: "Booking updated successfully" });
          } else {
            res.status(400).json({ error: "Booking not updated" });
          }
        }
      }
    } else {
      res.status(400).json({ error: "Invalid id" });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error });
  }
});

//delete booking
bookingRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (Types.ObjectId.isValid(id)) {
      const booking = await Booking.findByIdAndDelete({ _id: id });
      if (booking) {
        res.status(400).json({ message: "booking deleted successfully" });
      } else {
        res.status(404).json({ error: "Booking not found" });
      }
    } else {
      res.status(400).json({ error: "invalid booking id" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = bookingRouter;
