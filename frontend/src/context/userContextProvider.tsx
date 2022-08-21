import { useReducer } from "react";
import type {
  UserContextProviderProps,
  UserAction,
  UserState,
} from "../utils/types";
import { UserActionType } from "../utils/types";
import UserContext from "./userContext";

const defaultUser = {
  user: null,
};

const userReducer = (state: UserState, action: UserAction) => {
  switch (action.type) {
    case UserActionType.SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case UserActionType.REMOVE_USER:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const [userState, dispatchUser] = useReducer(userReducer, defaultUser);

  return (
    <UserContext.Provider value={{ state: userState, dispatch: dispatchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
