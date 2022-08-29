// BASIC
export type User = {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  isAdmin: boolean;
  token: string;
};

export type Message = {
  _id: string;
  message: string;
  sender: User;
  readBy: User[];
  chat: Chat;
};

// USER CONTEXT
export type UserContextProviderProps = {
  children: React.ReactNode;
};

export enum UserActionType {
  SET_USER = "SET_USER",
  REMOVE_USER = "REMOVE_USER",
}

export type UserState = {
  user: User | null;
};

export type UserAction =
  | { type: UserActionType.SET_USER; payload: User }
  | { type: UserActionType.REMOVE_USER };

// SINGUP AND LOGIN PROPS
export type AuthProps = {
  setSignupOrLogin: React.Dispatch<React.SetStateAction<string>>;
};

// CHAT CONTEXT
export type Chat = {
  _id: string;
  name: string;
  isGroup: boolean;
  users: User[];
  latestMessage: Message;
  groupAdmin: User | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ChatContextProviderProps = {
  children: React.ReactNode;
};

export enum ChatActionType {
  SET_SELECTED_CHAT = "SET_SELECTED_CHAT",
  SET_CHATS = "SET_CHATS",
  APPEND_CHAT = "APPEND_CHAT",
}

export type ChatState = {
  selectedChat: Chat | null;
  chats: Chat[];
};

export type ChatAction =
  | { type: ChatActionType.SET_SELECTED_CHAT; payload: Chat | null}
  | { type: ChatActionType.SET_CHATS; payload: Chat[] }
  | { type: ChatActionType.APPEND_CHAT; payload: Chat };
