const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  username: String,
});

module.exports = mongoose.model("user", UserSchema);
