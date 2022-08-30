import { Chat, User } from "./types";

export const getSender = (user: User | null, users: User[]): User => {
  return user?._id === users[0]._id ? users[1] : users[0];
};

export const isAdmin = (user: User | null, chat: Chat): boolean => {
  return user?._id === chat.groupAdmin?._id;
}