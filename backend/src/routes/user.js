const express = require("express");
const router = express.Router();

const { register, login, findUserByUsername } = require("../controllers/user");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/users", authMiddleware, findUserByUsername);

module.exports = router;
