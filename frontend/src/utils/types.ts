export type User = {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  isAdmin: boolean;
  token: string;
};

export type Message = {
  message: string;
};

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

export  type AuthProps = {
    setSignupOrLogin: React.Dispatch<React.SetStateAction<string>>
  }