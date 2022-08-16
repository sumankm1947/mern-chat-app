const express = require("express");
const router = express.Router();
const { getAllMessages, sendMessage } = require("../controllers/message");
const { auth } = require("../middlewares/auth");

// GET MESSAGES OF A CHAT
router.route("/:chatId").get(auth, getAllMessages);

// SEND MESSAGE
router.route("/").post(auth, sendMessage);

module.exports = router;
