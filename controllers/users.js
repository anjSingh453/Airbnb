const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup = async (req , res)=>{
try{
let {username , email , password} = req.body;
const newuser = new User({email , username});
const regsiterUser = await User.register(newuser , password);
console.log(regsiterUser);
req.login(regsiterUser , (err)=>{
    if(err){
        return next(err);
    }
    req.flash("success" , "Welcome to Wanderlust");
})
}
catch(err){
   req.flash("error" , err.message);
   res.redirect("/signup"); 
}
}


module.exports.renderLoginForm = (req , res)=>{
    res.render("users/login.ejs");
}

module.exports.login =  async (req, res)=>{
    req.flash( "success" ,"Welcome back to Wanderlust! You are logged in");
    let redirectURL =res.locals.redirectURL || "/listings";
    res.redirect(redirectURL);
    }

module.exports.logout = (req , res , next)=>{
    //yeh jo req.logout method hai it take a callback function in parameter
         req.logout((err)=>{
            if(err){
            return next(err);
            }
            req.flash("success" ,"you are logged out");
            res.redirect("/listings");
         })
    }