import { Message } from "./types";

export const messageSenderMargin = (m: Message, userId: string | undefined) => {
  if (m.sender._id === userId) return "flex-end";
  else return "flex-start";
};

export const isSameUser = (message: Message, userId: string | undefined) => {
  return message.sender._id === userId;
};

export const isLastMessageFromAUser = (messages: Message[], message: Message, index: number) => {
  if (messages[messages.length - 1]._id === message._id) {
    return true;
  }
  else if (message.sender._id === messages[index + 1].sender._id) return false;
  return true;
};
