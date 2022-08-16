const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const generateToken = require("../utils/token");

module.exports.allUsers = asyncHandler(async (req, res, next) => {
  const keyword = req.query.search
    ? { name: { $regex: req.query.search, $options: "i" } }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports.signup = asyncHandler(async (req, res, next) => {
  const { name, email, password, confirmPassword, avatar } = req.body;
  if (!name || !email || !password || !confirmPassword) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  if (password !== confirmPassword) {
    res.status(400);
    throw new Error("Passwords do not match");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    avatar,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } else {
    throw new Error("User not created. Something went wrong!");
  }
});

module.exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User does not exist");
  }

  const isMatch = await user.isMatched(password);
  if (!isMatch) {
    res.status(400);
    throw new Error("Incorrect password");
  }

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } else {
    throw new Error("User not found");
  }
});
