const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getUser,
  getUsers,
  getUsersByUsername,
} = require("../controllers/user");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/users", authMiddleware, getUsersByUsername);
router.post("/register", register);
router.post("/login", login);

module.exports = router;
