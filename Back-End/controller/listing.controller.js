const Listing = require("../Model/listing.model.js");
const errorHandler = require("../utils/error.js");
const mongoose = require("mongoose");
const createListing = async (req, res, next) => {
  try {
    const newlisting = new Listing(req.body);
    await newlisting.save();
    console.log(newlisting);
    res.status(200).json(newlisting);
  } catch (error) {
    next(error);
  }
};
const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  console.log(listing);
  if (!listing) {
    return next(errorHandler(404, "listing not found"));
  }
  console.log(listing.userRef);
  if (listing.userRef != req.user.id) {
    next(errorHandler(401, "you can only  delete your listings"));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("deleted suucessfully.");
  } catch (error) {
    next(error);
  }
};
const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "listing not found"));
  }
  if (req.user.id != listing.userRef) {
    return next(errorHandler(404, "your listing only you can edit"));
  }

  try {
    const updatedlisting = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedlisting);
  } catch (error) {
    next(error);
  }
};
const getlisting = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "listing not found"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};
const searching = async (req, res, next) => {
  try {

   
    const limit = parseInt(req.query.limit) || 10;
     const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [true, false] };
      
    }
    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [true, false] };
    }
    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [true, false] };
    }
    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["rent", "sell"] };
    }
    const searchTerm = req.query.searchTerm || " ";
    const sort = req.query.sort || "created_At";
    const order = req.query.order || "desc";
    
    const listing = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    }).sort({[sort]:order}).limit(limit).skip(startIndex)
    
    res.status(200).json(listing)
  } catch (error) {
    next(error)
  }
};

module.exports = { createListing, deleteListing, updateListing, getlisting ,searching};
