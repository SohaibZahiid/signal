const express = require("express");
const router = express.Router();

const { register, login, findUserByUsername } = require("../controllers/user");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerMiddleware");

router.post("/register", upload.single("image"), register);
router.post("/login", login);
router.get("/users", authMiddleware, findUserByUsername);

module.exports = router;
