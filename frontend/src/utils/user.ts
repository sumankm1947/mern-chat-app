import { User } from "./types";

export const getSender = (user: User | null, users: User[]): User => {
  return user?._id === users[0]._id ? users[1] : users[0];
};
