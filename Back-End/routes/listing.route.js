const express = require("express");
const {
  createListing,
  deleteListing,
  updateListing,
  getlisting,
  searching,
} = require("../controller/listing.controller");
const verifyUser = require("../utils/verifyUser");
const router = express.Router();

router.post("/create", verifyUser, createListing);
router.delete("/delete/:id", verifyUser, deleteListing);
router.post("/update/:id", verifyUser, updateListing);
router.get("/getlisting/:id", getlisting);
router.get("/searching", searching);

module.exports = router;
