import { useEffect, useReducer } from "react";
import type {
  UserContextProviderProps,
  UserAction,
  UserState,
} from "../utils/types";
import { UserActionType } from "../utils/types";
import UserContext from "./userContext";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") as string);
    dispatchUser({ type: UserActionType.SET_USER, payload: userInfo });

    if (!userInfo) navigate("/", { replace: true });
  }, [navigate]);

  return (
    <UserContext.Provider value={{ state: userState, dispatch: dispatchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
