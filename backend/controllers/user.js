const { Router } = require("express");
const Joi = require("joi");
const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const { Types } = require("mongoose");
const jwt = require("jsonwebtoken");

const userRouter = Router();
const { JWT_CODE = "jafha71yeiqquy1#@!" } = process.env;

//register new user
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
        console.log(password);
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
userRouter.post("/login", async (req, res) => {
  try {
    console.group("try block");
    const { email, password } = req.body;
    //validate
    const schema = Joi.object({
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
    });
    const { error } = schema.validate({ email, password });
    if (error) {
      res.status(400).json({ error: error.details[0].message });
    } else {
      const user = await User.findOne({ email });
      if (user) {
        const result = await bcrypt.compare(password, user.password);

        if (result) {
          const token = await jwt.sign({ email: user.email }, JWT_CODE);
          res.json({ user, token });
        } else {
          res.status(400).json({ error: "wrong password" });
        }
      } else {
        res.status(400).json({ error: "user not exist" });
      }
    }
  } catch (error) {
    console.log("catch block");
    console.error("error -", error);
    res.status(400).json({ error });
  }
});

//reset password
userRouter.post("/resetPassword/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    console.log("id - ", id);
    console.log("password ", password);
    if (Types.ObjectId.isValid(id)) {
      const user = await User.findById({ _id: id });
      if (!user) {
        res.status(400).json({ error: "Provide correct user id" });
      } else {
        // Input validation
        const schema = Joi.object({
          password: Joi.string()
            .required()
            .min(8)
            .max(20)
            .regex(
              /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$/
            )
            .messages({
              "string.base": `"password" should be a type of 'text'`,
              "string.pattern.base": `"password" should have one uppercase, lowercase, digit and special character`,
              "string.min": `"password" should have min 8 characters`,
              "string.max": `"password" should have max 20 characters`,
              "any.required": `"password" is a required field`,
            }),
        });

        const { error } = schema.validate({ password });
        if (error) {
          res.status(400).json({ error: error.details[0].message });
        } else {
          // Encrypting password before updating user
          if (password) {
            user.password = bcrypt.hashSync(password, 10);
          }
          user.save().then((user) => {
            res.json({ user, message: "Password updated successfully" });
          });
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

//update user
userRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { cash, interac } = req.body;

    console.log("id - ", id);
    if (Types.ObjectId.isValid(id)) {
      const user = await User.findById({ _id: id });
      if (!user) {
        res.status(400).json({ error: "Provide correct user id" });
      } else {
        if (typeof cash !== "boolean" && !interac) {
          res.status(400).json({ error: "Must provide cash or interac" });
        } else {
          if (typeof cash === "boolean") {
            user.cash = cash;
          }
          if (interac) {
            user.interac = interac;
          }
          user.save().then((user) => {
            res.json({ user, message: "Password updated successfully" });
          });
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

//detete user
userRouter.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.query;
    //validate
    if (Types.ObjectId.isValid(id)) {
      const user = await User.findByIdAndDelete({ _id: id });
      if (user) {
        res.status(400).json({ message: "deleted successfully" });
      } else {
        res.status(404).json({ error: "user not found" });
      }
    } else {
      res.status(400).json({ error: "invalid user id" });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error });
  }
});

module.exports = userRouter;
