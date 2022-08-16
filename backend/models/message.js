const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      trim: true,
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat", 
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
