const express = require("express");

const verifyUser = require("../utils/verifyUser");
const {updateUser,deleteUser, getuserlisting, getcontact}=require("../controller/user.controller");
const router = express.Router();

router.post("/update/:id", verifyUser, updateUser);
router.delete("/delete/:id", verifyUser, deleteUser);
router.get("/listing/:id", verifyUser,getuserlisting);
router.get("/contact/:id",verifyUser,getcontact)

module.exports = router;
