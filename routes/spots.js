const express = require("express");
const router = express.Router();
const Spot = require("../models/spot");

// INDEX
router.get("/", function(req, res) {
  console.log(req.user);
  //get all spots from DB
  Spot.find({}, function(err, allSpots) {
    if (err) {
      console.log(err);
    } else {
      res.render("spots/index", {spots:allSpots});
    }
  });
});

// CREATE - add new spot to DB
router.post("/spots", function(req, res) {
  let name = req.body.name;
  let image = req.body.image;
  let desc = req.body.description;
  let newSpot = {name: name, image: image, description: desc};
  Spot.create(newSpot, function(err, newlyCreated) {
    if (err) {
      console.log("error");
    } else {
      res.redirect("/spots");
    }
  });
});

// NEW - takes us to new form
router.get("/spots/new", function(req, res) {
  res.render("new.ejs");
});

// SHOW - info about one spot
router.get("/spots/:id", function(req, res) {
  Spot.findById(req.params.id, function(err, foundSpot) {
    if (err) {
        console.log(err);
    } else {
      res.render("show", {spot: foundSpot});
    }
  });
  req.params.id;
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect("/login");
}

module.exports = router;
