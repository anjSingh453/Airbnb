const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


const validateReview = (req, res, next) => {
    let { error } =  reviewSchema.validate(req.body.listing); // Adjust for nested structure
  
    if (error) {
      let errmsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errmsg);
    } else {
      next();
    }
  };



// post route for review
router.post("/", validateReview ,wrapAsync( async (req, res) => {
  
    let listing = await Listing.findById(req.params.id);

    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    
    await newReview.save(); // Save the new review
    await listing.save(); // Save the updated listing

    console.log("New review saved");
    req.flash("success" , "New Review Created!");
    res.redirect(`/listings/${listing._id}`); // Redirect to the listing page
 
}));


// post route for delete review
router.delete("/:reviewId", wrapAsync(async (req,res)=>{
let {id , reviewId} =req.params;

await Listing.findByIdAndUpdate(id ,{$pull :{reviews:reviewId}});  //here we pull funciton of mongo to delte from array also
await Review.findById(reviewId);
req.flash("success" , "Review  Deleted!");
res.redirect(`/listings/${id}`);
}))

module.exports =router;
