const express= require("express");
const app = express();
const mongoose =require("mongoose");
const Listing = require("./models/listing.js");
const  methodOverride = require("method-override");
const wrapAsync =require("./utils/wrapAsync.js");
const  ExpressError = require("./utils/expressError.js");
const {listingSchema}=require("./schema.js");


app.use(express.json()); 
app.use(methodOverride("_method"));

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})

app.get("/" ,(req , res)=>{
    res.send("Hi i am root");
})

// creating the database
const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
await mongoose.connect(MONGO_URL);
}

// app.get("/testListing" ,async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"My New Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute , Goa",
//         country :"India",
//     });
// await sampleListing.save();
// console.log("sample was saved");
// res.send("successful testing");
// });


// index route
// get req karge and show all listings

// / for ejs
const path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



// const validateListing=(req ,res,next)=>{
//     console.log(req.body); // Log the incoming request body
   
//     let {error} =listingSchema.validate(req.body);

//     if(error){
//         let errmsg = error.details.map((el)=>el.message).join(",");
//         throw new ExpressError(400 ,errmsg);
//     }
//     else{
//         next();
//     }
// }

// const validateListing = (req, res, next) => {
//     console.log(req.body); // Log the incoming request body
    
//     // Flatten nested listing object
//     const listingData = req.body.listing;

//     let { error } = listingSchema.validate(listingData);

//     if (error) {
//         let errmsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errmsg);
//     } else {
//         next();
//     }
// };

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body.listing); // Adjust for nested structure

    if (error) {
        const errmsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errmsg);
    } else {
        next();
}
};







// Index route to show all listings
app.get("/listings",wrapAsync ( async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", { alllistings });
}));

// Create route for making a new listing
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});
 

app.use(express.urlencoded({extended:true}));
app.post("/listings" , validateListing, wrapAsync (async(req, res , next) => {
    
        // console.log(req.body);  
        const {  title, description, image, price, country, location } = req.body;

        const newListing = new Listing({
            title,
            description,
            image,
            price,
            country,
            location
        });

        await newListing.save();
        res.redirect("/listings");
}));



 
 


//Edit Route
app.get("/listings/:id/edit", wrapAsync (async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  }));
  
  //Update Route
  app.put("/listings/:id", validateListing, wrapAsync (async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  }));

//Delete Route
app.delete("/listings/:id", wrapAsync (async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  }));


// jo bhi data aa raha vo parse ho paye isliye humne yeh line likhi hai
// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));
// Show route to read a specific listing
app.get("/listings/:id",  wrapAsync (async (req, res) => {
    let { id } = req.params;
    const list = await Listing.findById(id);
    res.render("listings/show.ejs", { list });
}));


 








//  for read operation we make only one route which is show route and show.ejs
// for create operation we make 2 route -- new route and create route
// new route(get , build form) ka response hoga create route (post) jo main route jo show route ho use par jayega
// for update operation we make 2 route edit route and update route
// on edit route we have get req in  form and  res to update route via put



// styling k liye we use ejs-mate
const ejsMate= require("ejs-mate");
app.engine("ejs" , ejsMate);

// to use static file we use this and public is our static file
app.use(express.static(path.join(__dirname,"/public")));


 




app.all("*" , (req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
})
// create middleware to handle error
app.use((err,req,res,next)=>{
    let {statusCode=500, message="Something went wrong!"}=err;  //deconstruct karma
    // res.status(statusCode).send(message);
    res. status(statusCode).render("error.ejs" ,{message});
});

const testData = {
    title: "Test Listing",
    description: "Test Description",
    price: 100,
    location: "Test Location",
    country: "Test Country",
};

const { error } = listingSchema.validate(testData);
console.log(error ? error.details : "Validation passed!");
