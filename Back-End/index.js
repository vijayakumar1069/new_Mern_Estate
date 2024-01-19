const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const dotenv = require("dotenv").config();
const userRouter = require("./routes/user.router.js");
const authRouter = require("./routes/auth.router.js");
const listingRouter=require("./routes/listing.route.js")
const cookieparser=require("cookie-parser")

const app = express();
app.use(cors());
app.use(bodyparser.json());
app.use(express.json());
app.use(cookieparser())

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log("db connected ");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(process.env.PORT, (req, res) => {
  console.log("port is running", process.env.PORT);
});
