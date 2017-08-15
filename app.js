const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Spot = require("./models/spot");


mongoose.connect("mongodb://localhost/askJiro");
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

// Spot.create({
//   name:  "Ozumo",
//   image: "http://www.splashofpretty.com/wp-content/uploads/2012/06/jiro-sushi-5.jpg",
//   description: "The nicest place in the financial district",
// });

// //INDEX
// app.get("/", function(req, res) {
//   Spot.find({}, function(err, allSpots) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.render('index', {spots:allSpots});
//     }
// });

// const spots = [
//   {name: "Sushi 85 & Ramen", image: "http://coolerinsights.com/wp-content/uploads/2014/04/jiro-dreams-of-sushi-2.png"},
//   {name: "Sushi 88", image: "https://static1.squarespace.com/static/530e4e29e4b0ac922f793833/5555b4f8e4b017690865e81b/5555b4fbe4b0d1d3fb1c7b36/1431680571141/Sukiyabashi-Jiro-Akagai.jpeg"},
//   {name: "Ozumo", image: "http://www.splashofpretty.com/wp-content/uploads/2012/06/jiro-sushi-5.jpg"},
// ];

// INDEX
app.get("/spots", function(req, res) {
  Spot.find({}, function(err, allSpots) {
    if (err) {
      console.log(err);
    } else {
      res.render("spots", {spots:allSpots});
    }
  });
});

// CREATE - add new spot to DB
app.post("/spots", function(req, res) {
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
app.get("/spots/new", function(req, res) {
  res.render("new.ejs");
});

// SHOW - info about one spot
app.get("/spots/:id", function(req, res) {
  Spot.findById(req.params.id, function(err, foundSpot) {
    if (err) {
        console.log(err);
    } else {
      res.render("show", {spot: foundSpot});
    }
  });
  req.params.id;
});

app.listen(3000, process.env.IP, function() {
  console.log('The SushiSpot Server is Listening!');
});
