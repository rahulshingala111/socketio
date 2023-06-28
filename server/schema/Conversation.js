const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    member: Array,
  },
  { timestamp: true }
);

module.exports = mongoose.model("conversation", UserSchema);