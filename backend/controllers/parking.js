const Router = require("express");
const Parking = require("../models/parkingSchema");
const Joi = require("joi");
const Types = require("mongoose");

const parkingRouter = Router();

//create parking

parkingRouter.post("/", async (req, res) => {
  try {
    let { name, address, city, lat, long, user_id } = req.body;

    const schema = Joi.object({
      name: Joi.string().required(),
      address: Joi.string().required(),
      city: Joi.string().required(),
      lat: Joi.string().required(),
      long: Joi.string().required(),
      user_id: Joi.string().required(),
    });

    const { error } = schema.validate({
      name,
      address,
      city,
      lat,
      long,
      user_id,
    });
    if (error) {
      res.status(400).json({ error: error.details[0].message });
    } else {
      const parking = await Parking.create({
        name,
        address,
        city,
        lat,
        long,
        user_id,
      });
      res.json({ message: "parking created succeessfully", parking });
    }
  } catch (error) {
    console.error("error-", error);
    res.status(400).json({ error });
  }
});

//get existing parking

//update parking
parkingRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (Types.isValidObjectIdbjectId(id)) {
      const parking = await Parking.findById({ _id: id });
      if (!parking) {
        res.status(400).json({ error: "wrong parking id" });
      } else {
        const schema = Joi.object({
          name: Joi.string().required(),
          address: Joi.string().required(),
          city: Joi.string().required(),
          lat: Joi.string().required(),
          long: Joi.string().required(),
          user_id: Joi.string().required(),
        });

        let { name, address, city, lat, long, user_id } = parking;
        user_id = user_id.toString();
        const updatedParkingObj = {
          name,
          address,
          city,
          lat,
          long,
          user_id,
          ...req.body,
        };

        const { error } = schema.validate(updatedParkingObj);
        if (error) {
          res.status(400).json({ error: error.details[0].message });
        } else {
          const updateParking = await parking.updateOne(updatedParkingObj);
          if (updateParking) {
            res.json({ message: "parking updated successfully" });
          } else {
            res.status(400).json({ error: "parking not updated" });
          }
        }
      }
    } else {
      res.status(400).json({ error: "invalid id" });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error });
  }
});

//delete parking
parkingRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (Types.isValidObjectId(id)) {
      const parking = await parking.findByIdAndDelete({ _id: id });
      if (parking) {
        res.status(400).json({ message: "parking delete successfully" });
      } else {
        res.status(404).json({ error: "parking not found" });
      }
    } else {
      res.status(400).json({ message: "invalid parking id" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = parkingRouter;
