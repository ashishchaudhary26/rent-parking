const { Router } = require("express");
const Joi = require("joi");
const PaymentMethod = require("../models/paymentMethodSchema");
const { Types } = require("mongoose");

const paymentMethodRouter = Router();

//create new payment
paymentMethodRouter.post("/", async (req, res) => {
  try {
    const { cash } = req.body;

    //validation
    const schema = Joi.object({
      cash: Joi.boolean().required(),
    });

    const { error } = schema.validate({ cash });
    if (error) {
      res.status(400).json({ error: error.details[0].message });
    } else {
      const paymentMethod = await PaymentMethod.create({ cash });
      res.json({ paymentMethod, message: "payment method created" });
    }
  } catch (error) {
    console.error("error ", error);
    res.status(400).json({ error });
  }
});

//get existing payment list
paymentMethodRouter.get("/", async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.find({});

    res.json(paymentMethod);
  } catch (error) {
    res.status(400).json({ error });
  }
});

//update payment method
paymentMethodRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (Types.ObjectId.isValid(id)) {
      const paymentMethod = await PaymentMethod.findById({ _id: id });
      if (!paymentMethod) {
        res.status(400).json({ error: "Provide correct paymentMethod id" });
      } else {
        // Input validation
        const schema = Joi.object({
          cash: Joi.boolean().required(),
        });

        let { cash } = paymentMethod;
        let updatedPaymentMethodObj = { cash, ...req.body.cash };

        const { error } = schema.validate(updatedPaymentMethodObj);
        if (error) {
          res.status(400).json({ error: error.details[0].message });
        } else {
          updatedPaymentMethodObj = { cash, ...req.body };

          const updatedPaymentMethod = await PaymentMethod.updateOne(
            updatedPaymentMethodObj
          );
          if (updatedPaymentMethod) {
            res.json({ message: "PaymentMethod updated successfully" });
          } else {
            res.status(400).json({ error: "PaymentMethod not updated" });
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

//delete payment method
paymentMethodRouter.route("/:id").delete(async (req, res) => {
  try {
    const { id } = req.params;

    // Validate id and delete paymentMethod if exist
    if (Types.ObjectId.isValid(id)) {
      const paymentMethod = await PaymentMethod.findByIdAndDelete({ _id: id });

      if (paymentMethod) {
        res.json({ message: "PaymentMethod deleted successfully" });
      } else {
        res.status(404).json({ error: "PaymentMethod not found" });
      }
    } else {
      res.status(400).json({ error: "Invalid paymentMethod id" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});
