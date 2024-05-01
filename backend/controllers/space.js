const { Router } = require("express");
const Joi = require("joi");
const { Types } = require("mongoose");
const Space = require("../models/spaceSchema");

const spaceRouter = Router();

//create new space
spaceRouter.post("/", async (req, res) => {
  try {
    let { name, date, slot_start_time, slot_end_time, price, parking_id } =
      req.body;

    // Input validation
    const schema = Joi.object({
      name: Joi.string().required(),
      date: Joi.date().required(),
      slot_start_time: Joi.string().required(),
      slot_end_time: Joi.string().required(),
      price: Joi.number().required(),
      parking_id: Joi.string().required(),
    });

    const { error } = schema.validate({
      name,
      date,
      slot_start_time,
      slot_end_time,
      price,
      parking_id,
    });
    if (error) {
      res.status(400).json({ error: error.details[0].message });
    } else {
      const space = await Space.create({
        name,
        date,
        slot_start_time,
        slot_end_time,
        price,
        parking_id,
      });
      res.json({ message: "Space created", space });
    }
  } catch (error) {
    console.error(" error - ", error);
    res.status(400).json({ error });
  }
});

//get space list

//update space
spaceRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (Types.ObjectId.isValid(id)) {
      const space = await Space.findById({ _id: id });
      if (!space) {
        res.status(400).json({ error: "wrong space id" });
      } else {
        const schema = Joi.object({
          name: Joi.string().required(),
          date: Joi.date().required(),
          slot_start_time: Joi.string().required(),
          slot_end_time: Joi.string().required(),
          price: Joi.number().required(),
          parking_id: Joi.string().required(),
        });

        let { name, date, slot_start_time, slot_end_time, price, parking_id } =
          space;
        parking_id = parking_id.toString();
        const updatedSpaceObj = {
          name,
          date,
          slot_start_time,
          slot_end_time,
          price,
          parking_id,
          ...req.body,
        };

        const { error } = schema.validate(updatedSpaceObj);
        if (error) {
          res.status(400).json({ error: error.details[0].messages });
        } else {
          updatedSpace = await space.updateOne(updatedSpaceObj);
          if (updatedSpace) {
            res.status(400).json({ message: "updated successfully" });
          } else {
            res.status(400).json({ error: "not updated" });
          }
        }
      }
    } else {
      res.status(400).json({ error: "invalid id" });
    }
  } catch (error) {
    console.error(" error - ", error);
    res.status(400).json({ error });
  }
});

//Delete space
spaceRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (Types.ObjectId.isValid(id)) {
      const space = await Space.findByIdAndDelete({ _id: id });
      if (space) {
        res.status(400).json({ message: "deleted successfully" });
      } else {
        res.status(400).json({ error: "space not found" });
      }
    } else {
      res.status(400).json({ error: "invalid space id" });
    }
  } catch (error) {
    console.error(" error - ", error);
    res.status(400).json({ error });
  }
});

module.exports = spaceRouter;
