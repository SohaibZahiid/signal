const express = require("express");
const router = express.Router();

const { sendMessage, getMessages } = require("../controllers/message");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/:receiverId", authMiddleware, sendMessage);
router.get("/:receiverId", authMiddleware, getMessages);

module.exports = router;
