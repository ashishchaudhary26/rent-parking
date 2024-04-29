const { Router } = require("express");
const Joi = require("joi");
const { Types } = require("mongoose");
const Space = require("../models/spaceSchema");

const spaceRouter = Router();

//create new space
spaceRouter.post("/", async (req, res) => {
    try {
        let { name, date, slot_start_time, slot_end_time, price, parking_id } = req.body

        // Input validation
        const schema = Joi.object({
            name: Joi.string().required(),
            date: Joi.date().required(),
            slot_start_time: Joi.string().required(),
            slot_end_time: Joi.string().required(),
            price: Joi.number().required(),
            parking_id: Joi.string().required(),
        })

        const { error } = schema.validate({ name, date, slot_start_time, slot_end_time, price, parking_id });
        if (error) {
            res.status(400).json({ error: error.details[0].message });
        }
        else {
            const space = await Space.create({ name, date, slot_start_time, slot_end_time, price, parking_id });
            res.json({ message: "Space created", space });
        }
    } catch (error) {
        console.error(" error - ", error);
        res.status(400).json({ error });
    }atch (error) {}
});
