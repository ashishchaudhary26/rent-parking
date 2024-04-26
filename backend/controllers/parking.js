const Router = require("express");
const Parking = require("../models/parkingSchema");
const Joi = require("joi");
const Types = require("mongoose");

const parkingRouter = Router();
