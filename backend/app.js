const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { connectDB } = require("./config/db.configuration");
const bookingRouter = require("./controllers/booking");
const parkingRouter = require("./controllers/parking");
const userRouter = require("./controllers/user");
const paymentMethodRouter = require("./controllers/paymentMethod");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 3000;

connectDB();

app.use("/user", userRouter);
app.use("/booking", bookingRouter);
app.use("/parking", parkingRouter);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});
