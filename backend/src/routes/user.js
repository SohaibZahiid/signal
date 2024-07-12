const express = require("express");
const router = express.Router();

const { register, login, getUsers } = require("../controllers/user");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/", authMiddleware, getUsers);

module.exports = router;
