const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      User = require("./models/user"),
      Spot = require("./models/spot"),

      authRoutes = require("./routes/auth"),
      spotRoutes = require("./routes/spots");



mongoose.connect("mongodb://localhost/askJiro");
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

//PASSPORT CONFIG
app.use(require("express-session")({
  secret: "we da best",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

// Spot.create({
//   name:  "Ozumo",
//   image: "http://www.splashofpretty.com/wp-content/uploads/2012/06/jiro-sushi-5.jpg",
//   description: "The nicest place in the financial district",
// });

//HOME
app.get("/", function(req, res) {
  res.render("index");
});
  Spot.find({}, function(err, allSpots) {
    if (err) {
      console.log(err);
    } else {
      res.render('index', {spots:allSpots});
    }
  });
});

// const spots = [
//   {name: "Sushi 85 & Ramen", image: "http://coolerinsights.com/wp-content/uploads/2014/04/jiro-dreams-of-sushi-2.png"},
//   {name: "Sushi 88", image: "https://static1.squarespace.com/static/530e4e29e4b0ac922f793833/5555b4f8e4b017690865e81b/5555b4fbe4b0d1d3fb1c7b36/1431680571141/Sukiyabashi-Jiro-Akagai.jpeg"},
//   {name: "Ozumo", image: "http://www.splashofpretty.com/wp-content/uploads/2012/06/jiro-sushi-5.jpg"},
// ];

// INDEX
app.get("/spots", function(req, res) {
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
//===========
//AUTH ROUTES
//===========


//show register form
app.get("/register", (req, res) => {
  res.render("register");
});

//handle sign up logic
app.post("/register", function(req, res) {
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
app.get("/login", function(req, res){
  res.render("login");
});

//login logic
app.post("/login", passport.authenticate("local",
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
app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/spots");

});

app.use("/", authRoutes);
app.use("/spots", spotRoutes);

app.listen(3000, process.env.IP, function() {
  console.log('The SushiSpot Server is Listening!');
});
