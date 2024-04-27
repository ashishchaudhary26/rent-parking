const Router = require("express");
const Joi = reuire("joi");
const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const { Types } = require("mongoose");
const jwt = require("jsonwebtoken");

const userRouter = Router();

//regester new user
userRouter.post("/register", async (req, res) => {
  try {
    let { name, email, password, type } = req.body;

    //validation
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().min(8).max(50).required().email(),
      password: Joi.string()
        .min(7)
        .max(15)
        .required()
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$/)
        .messages({
          "string.base": `"password" should be a type of 'text'`,
          "string.pattern.base": `"password" should have one uppercase, lowercase, digit and special character`,
          "string.min": `"password" should have min 6 characters`,
          "string.max": `"password" should have max 20 characters`,
          "any.required": `"password" is a required field`,
        }),
      type: Joi.string().valid("admin", "seeker", "owner"),
    });
    const { error } = schema.validate({ name, email, password, type });
    if (error) {
      res.status(400).json({ error: error.details[0].messages });
    } else {
      const user = await User.findOne({ email });
      if (user) {
        res.status(400).json({ error: "user already exist" });
      } else {
        password = bcrypt.hashSync(password, 10);
        const user = await User.create({ name, email, password, type });
        res.json(user);
      }
    }
  } catch (error) {
    console.error("error -", error);
    res.status(400).json({ error });
  }
});

//get users
userRouter.get("/", async (req, res) => {
  try {
    const user = await User.find({});
    res.json(user);
  } catch (error) {
    console.error("error -", error);
    res.status(400).json({ error });
  }
});

//login
