const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  room: String,
  username: String,
  message: String,
  time: String,
});

module.exports = mongoose.model("room", UserSchema);
