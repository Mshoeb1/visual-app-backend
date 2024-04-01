const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userData = mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userData);
module.exports = User;
