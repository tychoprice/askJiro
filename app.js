const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/askJiro");
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

//inline Schema for now
const spotSchema = new mongoose.Schema({
  name: String,
  image: String,
});

const Spot = mongoose.model("Spot", spotSchema);

Spot.create({
  name:  "Ozumo",
  image: "http://www.splashofpretty.com/wp-content/uploads/2012/06/jiro-sushi-5.jpg",
});

app.get("/", function (req, res) {
  res.render('landing');
});

// const spots = [
//   {name: "Sushi 85 & Ramen", image: "http://coolerinsights.com/wp-content/uploads/2014/04/jiro-dreams-of-sushi-2.png"},
//   {name: "Sushi 88", image: "https://static1.squarespace.com/static/530e4e29e4b0ac922f793833/5555b4f8e4b017690865e81b/5555b4fbe4b0d1d3fb1c7b36/1431680571141/Sukiyabashi-Jiro-Akagai.jpeg"},
//   {name: "Ozumo", image: "http://www.splashofpretty.com/wp-content/uploads/2012/06/jiro-sushi-5.jpg"},
// ];

app.get("/spots", function (req, res) {
  Spot.find({}, function(err, allSpots) {
    if (err) {
      console.log(err);
    } else {
      res.render("spots", {spots:allSpots});
    }
  });
  // res.render('spots', {spots:spots});
});

app.post("/spots", function (req, res) {
  let name = req.body.name;
  let image = req.body.image;
  let newSpot = {name: name, image: image};
  Spot.create(newSpot, function(err, newlyCreated) {
    if (err) {
      console.log("error");
    } else {
      res.redirect("/spots");
    }
  });
});

app.get("/spots/new", function (req, res) {
  res.render("new.ejs");
});

app.listen(3000, process.env.IP, function() {
  console.log('The SushiSpot Server is Listening!');
});
