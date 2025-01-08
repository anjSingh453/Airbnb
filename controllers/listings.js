const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const maptoken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken : maptoken});
 

module.exports.index = async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", { alllistings });
  }

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
  };

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const list = await Listing.findById(id)
    .populate({
      path : "reviews",
      populate : {
        path : "author",
      },
    })
    .populate("owner");
    if(!list){
      req.flash("error" , "Listing you requested for does not exit!");
      res.redirect("/listings");
    }
  
    res.render("listings/show.ejs", { list });
  }



module.exports.createListing =  async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
      limit: 1, 
    }).send();

      let url = req.file.path;
      let filename = req.file.filename
      // console.log(url , ".." , filename);
      const { title, description, image, price, country, location } = req.body.listing;
  
      const newListing = new Listing({
        title,
        description,
        image,
        price,
        country,
        location,
      });
      newListing.owner = req.user._id;  //by this jiss ne listing bani hai uska naam show hoga 
      newListing.image = {url , filename};
      newListing.geometry  =   response.body.features[0].geometry ;
     await newListing.save();
      req.flash("success" , "New Listing Created!");
      res.redirect("/listings");
    }


module.exports.renderEditForm = async (req, res) => {
      let { id } = req.params;
      const listing = await Listing.findById(id);
      if(!listing){
        req.flash("error" ,"Listing you requested for does not exit!");
        res.redirect("/listings");
      }
        
      let orginialUrl = listing.image.url;
      orginialUrl=orginialUrl.replace("/upload" , "/upload/h_300,w_250")

      res.render("listings/edit.ejs", { listing , orginialUrl });
    }

module.exports.updateListing = async (req, res) => {
      let { id } = req.params;
      let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
     
      if(typeof req.file != "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = {url , filename};
      await listing.save();
      }

      req.flash("success" , "Listing Updated!");
      res.redirect(`/listings/${id}`);
    }

module.exports.destoryListing = async (req, res) => {
      let { id } = req.params;
      let deletedListing = await Listing.findByIdAndDelete(id);
      console.log(deletedListing);
      req.flash("success" , "Listing Deleted!");
      res.redirect("/listings");
    }