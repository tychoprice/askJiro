const mongoose = require("mongoose");
const spotSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
});

module.exports = mongoose.model("Spot", spotSchema);
