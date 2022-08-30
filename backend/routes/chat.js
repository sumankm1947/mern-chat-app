const express = require("express");
const router = express.Router();
const {
  getOneOnOneChat,
  getAllChats,
  newGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
  exitGroup,
} = require("../controllers/chat");
const { auth } = require("../middlewares/auth");

// GET ONE ON ONE CHAT
router.route("/").all(auth).get(getAllChats).post(getOneOnOneChat);

// CREATE GROUP
router.route("/group").post(auth, newGroupChat);

// RENAME GROUP
router.route("/rename").put(auth, renameGroupChat);

// ADD USER TO GROUP
router.route("/add").put(auth, addToGroup);

// Exit from group
router.route("/exit").post(auth, exitGroup)

// REMOVE USER FROM GROUP
router.route("/remove").put(auth, removeFromGroup);

module.exports = router;
