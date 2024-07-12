const User = require("../models/User");
const Conversation = require("../models/Conversation");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (userExists) {
      return res.status(409).json("User already exists");
    }

    const userObj = { username, email, password };

    const user = await User.create(userObj);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const login = async (req, res) => {
  try {
    const userExists = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });

    if (!userExists) {
      return res.status(401).json("Invalid credentials");
    }

    const { password, ...user } = userExists.toObject();

    const token = jwt.sign(user, process.env.JWT_SECRET);

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getUsers = async (req, res) => {
  const loggedInUserId = req.user._id;
  try {
    const users = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    const conversations = await Conversation.find({
      members: loggedInUserId,
    });

    console.log({ conversations });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = { register, login, getUsers };
