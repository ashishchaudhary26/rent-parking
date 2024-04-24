const mongoose = require("mongoose");

const connectDB = () => {
  const url = "mongodb://127.0.0.1:27017/Rent_parking";

  mongoose.connect(url);

  mongoose.connection.once("open", async () => {
    console.log("Connected to database");
  });

  mongoose.connection.on("error", (err) => {
    console.log("Error connecting to database  ", err);
  });
};

module.exports = {
  connectDB,
};
