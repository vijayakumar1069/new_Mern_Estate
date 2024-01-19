const express = require("express");

const {
  signup,
  signin,
  google,
  signOutUser,
} = require("../controller/auth.controller");
const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.get("/signout", signOutUser);

module.exports = router;
