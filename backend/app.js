const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { connectDB } = require("./config/db.configuration");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

connectDB();

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});
