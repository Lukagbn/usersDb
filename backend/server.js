const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(cors());

const userRoute = require("./routes/users.js");
app.use("/users", userRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Mongoose running!");
    app.listen(PORT, () => console.log(`Listening to PORT: ${PORT}`));
  })
  .catch((err) => console.log("error:", err));
