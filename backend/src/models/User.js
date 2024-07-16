const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please add a username"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
  },
  imageUrl: {
    type: String,
    required: [true, "Please add a profile picture"],
  },
});

module.exports = mongoose.model("User", UserSchema);
