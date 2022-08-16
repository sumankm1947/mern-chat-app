const express = require("express");
const router = express.Router();
const { signup, login, allUsers } = require("../controllers/user");
const { auth } = require("../middlewares/auth");

router.route("/").get(auth, allUsers);
router.route("/signup").post(signup);
router.route("/login").post(login);

module.exports = router;
