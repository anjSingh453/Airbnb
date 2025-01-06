const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req , res, next)=>{
    if(!req.isAuthenticated()){
      req.session.redirectURL = req.originalUrl;
        req.flash("error" ,"you must be logged in to create listing ");
        return res.redirect("/login");
      }
      next();
}

//where why we are saving our originalurl in locals
//because passport automatic login kare k baas orginalurl change kar deta but usko locals ka change
//karne ka acces nahi hai isliye
module.exports.saveRedirecturl = (req, res , next)=>{
if(req.session.redirectURL){
  res.locals.redirectURL = req.session.redirectURL;
}
next();
}

//middle for owner athorization
module.exports.isOwner = async ( req, res , next)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
      if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not the owner of the Listing");
        return res.redirect(`/listings/${id}`);
      }
      next();
}

module.exports.isReviewAuthor = async ( req, res , next)=>{
  let {id ,reviewId} = req.params;
  let  review = await Review.findById(reviewId);
      if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not the  Author of the Listing");
        return res.redirect(`/listings/${id}`);
      }
      next();
}