const asyncHandler = require("express-async-handler");
const Message = require("../models/message");
const User = require("../models/user");

// Get all messages of a chat
exports.getAllMessages = asyncHandler(async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name avatar")
      .populate("chat");

    res.status(200).json(messages);
  } catch (error) {
    res.status(500);
    throw error;
  }
});

// Send a message
exports.sendMessage = asyncHandler(async (req, res, next) => {
  const { message, chatId } = req.body;
  if (!chatId || !message)
    return res.status(400).send({ message: "Please fill all fields" });

  try {
    let newMessage = await Message.create({
      sender: user._id,
      message,
      chat: chatId,
    });

    newMessage = await newMessage.populate("sender", "name avatar").execPopulate();
    newMessage = await newMessage.populate("chat").execPopulate();
    newMessage = await User.populate(newMessage, {
        path: "chat.users",
        select: "name avatar"
    })

  } catch (error) {
    res.status(500);
    throw error;
  }
});
