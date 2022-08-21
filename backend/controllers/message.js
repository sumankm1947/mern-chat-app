const asyncHandler = require("express-async-handler");
const Message = require("../models/message");
const User = require("../models/user");
const Chat = require("../models/chat");

// Get all messages of a chat
exports.getAllMessages = asyncHandler(async (req, res, next) => {
  try {
    const { chatId } = req.params;

    // To check if the user is a part of the chat
    const { users } = await Chat.findById(chatId);
    if (!users.includes(req.user._id)) {
      return res
        .status(401)
        .json({ message: "You are not authorized to view this chat" });
    }

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
      sender: req.user._id,
      message,
      chat: chatId,
    });

    newMessage = await newMessage.populate("sender", "name avatar");
    newMessage = await newMessage.populate("chat");
    newMessage = await User.populate(newMessage, {
      path: "chat.users",
      select: "name avatar",
    });

    Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage });
    res.json(newMessage);
  } catch (error) {
    res.status(500);
    throw error;
  }
});
