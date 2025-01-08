const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const { listingSchema , reviewSchema} = require("../schema.js");
const {isLoggedIn , isOwner} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});



const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body.listing); // Adjust for nested structure

  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};

//mergering two route jo baar baar use ho rahe hai
router.route("/")
.get( wrapAsync(listingController.index))
.post(
    isLoggedIn,
    validateListing,
    upload.single("listing[image]") ,
    wrapAsync(listingController.createListing),
);
 

//  Create route for making a new listing
router.get("/new", isLoggedIn , listingController.renderNewForm  );


router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
  isLoggedIn,
  isOwner ,
  upload.single("listing[image]") ,
  validateListing,
  wrapAsync(listingController.updateListing)
)
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destoryListing)
);


// Index route to show all listings
// router.get( "/", wrapAsync(listingController.index));



// // Create route for making a new listing
// router.get("/new", isLoggedIn , listingController.renderNewForm  );
  
  // router.post(
  //   "/",
  //   isLoggedIn,
  //   validateListing,
  //   wrapAsync(listingController.createListing)
  // );



// Show route to read a specific listing
// router.get(
//     "/:id",
//     wrapAsync(listingController.showListing)
//   );



//Edit Route
router.get(
    "/:id/edit",  
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
  );
  
  //Update Route
  // router.put(
  //   "/:id",
  //   isLoggedIn,
  //   isOwner ,
  //   validateListing,
  //   wrapAsync(listingController.updateListing)
  // );
  
  //Delete Route
  // router.delete(
  //   "/:id",
  //   isLoggedIn,
  //   isOwner,
  //   wrapAsync(listingController.destoryListing)
  // );
  

module.exports =router;



//  for read operation we make only one route which is show route and show.ejs
// for create operation we make 2 route -- new route and create route
// new route(get , build form) ka response hoga create route (post) jo main route jo show route ho use par jayega
// for update operation we make 2 route edit route and update route
// on edit route we have get req in  form and  res to update route via put