const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.get("/", function (req, res) {
  res.render('landing');
});

const spots = [
  {name: "Sushi 85 & Ramen", image: "https://d1w5usc88actyi.cloudfront.net/wp-content/uploads/2013/09/Fstoppers-Kiliii-Fish-climbing-photo3.jpg"},
  {name: "Sushi 88", image: "http://i.huffpost.com/gen/1985279/images/o-ROCK-CLIMBING-SUNSET-facebook.jpg"},
  {name: "Ozumo", image: "https://cdn2.hubspot.net/hubfs/543657/featured_post_03.jpg"},
];

app.get("/spots", function (req, res) {
  res.render('spots', {spots:spots});
});

app.post("/spots", function (req, res) {
  let name = req.body.name;
  let image = req.body.image;
  let newSpot = {name: name, image: image};
  spots.push(newSpot);
  res.redirect("/spots");
});

app.get("/spots/new", function (req, res) {
  res.render("new.ejs");
});

app.listen(3000, process.env.IP, function() {
  console.log('The SushiSpot Server is Listening!');
});
