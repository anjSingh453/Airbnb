if(process.env.NODE_ENV != "production"){  //so that yeh deployment k time file na jaye
  require("dotenv").config();
  }
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expressError.js");
const { listingSchema , reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const listingsRouter =require("./routes/listing.js");
const reviewsRouter =require("./routes/reviews.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");

 



// styling k liye we use ejs-mate
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
const path = require("path");
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// to use static file we use this and public is our static file
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(methodOverride("_method"));

// session option
const sessionOptions ={
  secret : "secretkey",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires : Date.now() + 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly: true,
  },
};

app.get("/", (req, res) => {
  res.send("Hi i am root");
});

app.use(session(sessionOptions));
app.use(flash());

//middleware that support passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




// middleware for flash
app.use((req,res,next)=>{
  res.locals.success =req.flash("success");
  res.locals.error =req.flash("error");
  res.locals.currUser = req.user;
  next();
})

// app.get("/demouser" , async(req, res)=>{
//   let fakeuser = new User({
//     email: "studen@gmail.com",
//     username : "delta student",
//   });
//   let registeruser = await User.register(fakeuser , "helloword");
//   res.send((registeruser));
// })

// creating the database
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}
 

// use routing 
app.use("/listings" , listingsRouter);
app.use("/listings/:id/reviews" , reviewsRouter);
app.use("/" , userRouter);

// jo bhi data aa raha vo parse ho paye isliye humne yeh line likhi hai
// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));
 
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

// create middleware to handle error
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err; //deconstruct karma
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});


 