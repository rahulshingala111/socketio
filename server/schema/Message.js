const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    conversationId: String,
    sender: String,
    text: String,
    nameOFfile: String,
  },
  { timestamp: true }
);

module.exports = mongoose.model("message", UserSchema);
