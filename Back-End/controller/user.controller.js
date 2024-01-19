const User = require("../Model/userModel");
const errorHandler = require("../utils/error");
const bcrypt = require("bcryptjs");
const Listing = require("../Model/listing.model.js");

const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "you can only updatae your account "));
  }
  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    const upodateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password, ...rest } = upodateUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "unauthorized token"));
  }
  try {
    await User.findByIdAndDelete(req.user.id);
    res.clearCookie("access_token");
    res.status(200).json("user hase been deleted");
  } catch (error) {
    next(error);
  }
};
const getuserlisting = async (req, res, next) => {
  console.log(req.user.id);
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "you bcan only view your listing"));
  }
};
const getcontact = async (req, res, next) => {
  try {
    const listowner = await user.findById(req.params.id);
    if (!listowner) {
      return next(errorHandler(404, "owenr not found"));
    }
    const { password, ...rest } = listowner._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateUser,
  deleteUser,
  getuserlisting,
  getcontact,
};
