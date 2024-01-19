const bcrypt = require("bcryptjs");
const User = require("../Model/userModel.js");
const errorHandler = require("../utils/error.js");
const jwt = require("jsonwebtoken");
const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newuser = new User({
    username,
    password: hashedPassword,
    email,
  });
  try {
    await newuser.save();
    res.status(200).json("user added successfully");
  } catch (error) {
    next(error);
  }
};
const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const validateUser = await User.findOne({ email });
    if (!validateUser) {
      return next(errorHandler(404, "user not found"));
    }
    const validatePassword = bcrypt.compareSync(
      password,
      validateUser.password
    );
    if (!validatePassword) {
      return next(errorHandler(404, "Wrong email or passord"));
    }
    const token = jwt.sign(
      { id: validateUser._id },
      process.env.JWT_SECRET_KEY
    );
    console.log(token);
    const { password: pass, ...userInfo } = validateUser._doc;

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(userInfo); // DESTRUCTURING JSON
  } catch (error) {
    next(error);
  }
};
const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const googlegeneratepassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(googlegeneratepassword, 10);
      const newuser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        password: hashedPassword,
        email: req.body.email,
        avatar: req.body.photo,
      });
      await newuser.save();
      const token = jwt.sign({ id: newuser._id }, process.env.JWT_SECRET_KEY);
      const { password: pass, ...rest } = newuser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
const signOutUser = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("user has been loged out successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, signin, google ,signOutUser};
