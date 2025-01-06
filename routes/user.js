const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirecturl} = require("../middleware.js");
const userController = require("../controllers/users.js");


// create the signup user by  get and post  method
// get route (create form and take data)
router.get("/signup" , userController.renderSignupForm);
//post req (take data from form and save to db)
router.post("/signup" , wrapAsync(userController.signup))

// for login page
// same we use get and post route
// get route
router.get("/login" , userController.renderLoginForm);
// post route (authenicate karege)
router.post("/login" , 
    saveRedirecturl,
    passport.authenticate ("local" , {failureRedirect : "/login" , failureFlash:true}) ,
    userController.login
);


//for logout
router.get("/logout" ,  userController.logout);

module.exports = router;
