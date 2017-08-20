const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const Spot = require("../models/spot");

//===========
//AUTH ROUTES
//===========

//show register form
router.get("/register", (req, res) => {
  res.render("register");
});

//handle sign up logic
router.post("/register", function(req, res) {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function() {
      res.redirect("/spots");
    });
  });
});

//show login form
router.get("/login", function(req, res){
  res.render("login");
});

//login logic
router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/spots",
    failureRedirect: "/login",
  }), function(req, res){
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect("/login");
}

//logout route
router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/spots");

});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect("/login");
}

module.exports = router;
