const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const { listingSchema , reviewSchema} = require("../schema.js");
 


const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body.listing); // Adjust for nested structure

  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};


// Index route to show all listings
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", { alllistings });
  })
);



// Create route for making a new listing
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
  });
  
  router.post(
    "/",
    validateListing,
    wrapAsync(async (req, res, next) => {
      console.log(req.body);
      const { title, description, image, price, country, location } = req.body.listing;
  
      const newListing = new Listing({
        title,
        description,
        image,
        price,
        country,
        location,
      });
  
      await newListing.save();
      req.flash("success" , "New Listing Created!");
      res.redirect("/listings");
    })
  );



// Show route to read a specific listing
router.get(
    "/:id",
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      const list = await Listing.findById(id).populate("reviews");
      if(!list){
        req.flash("error" , "Listing you requested for does not exit!");
        res.redirect("/listings");
      }
      res.render("listings/show.ejs", { list });
    })
  );



//Edit Route
router.get(
    "/:id/edit",  
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      const listing = await Listing.findById(id);
      if(!listing){
        req.flash("error" ,"Listing you requested for does not exit!");
        res.redirect("/listings");
      }
      res.render("listings/edit.ejs", { listing });
    })
  );
  
  //Update Route
  router.put(
    "/:id",
    
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      await Listing.findByIdAndUpdate(id, { ...req.body.listing });
      req.flash("success" , "Listing Updated!");
      res.redirect(`/listings/${id}`);
    })
  );
  
  //Delete Route
  router.delete(
    "/:id",
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      let deletedListing = await Listing.findByIdAndDelete(id);
      console.log(deletedListing);
      req.flash("success" , "Listing Deleted!");
      res.redirect("/listings");
    })
  );
  

module.exports =router;



//  for read operation we make only one route which is show route and show.ejs
// for create operation we make 2 route -- new route and create route
// new route(get , build form) ka response hoga create route (post) jo main route jo show route ho use par jayega
// for update operation we make 2 route edit route and update route
// on edit route we have get req in  form and  res to update route via put