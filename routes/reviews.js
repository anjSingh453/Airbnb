const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn , isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");
const review = require("../models/review.js");


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
router.post("/",
    isLoggedIn,
   validateReview ,
   wrapAsync(reviewController.createReview)
);


// post route for delete review
router.delete("/:reviewId" ,
  isLoggedIn,
  isReviewAuthor ,
  wrapAsync(reviewController.destoryReveiw))

module.exports =router;
