const express = require("express");
const router = express.Router();

const { getUserConversations } = require("../controllers/conversation");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, getUserConversations);

module.exports = router;
