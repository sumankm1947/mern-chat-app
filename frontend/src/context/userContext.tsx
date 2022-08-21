import { createContext } from "react";
import { UserAction, UserState } from "../utils/types";

const UserContext = createContext<{
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
}>({
  state: {
    user: null,
  },
  dispatch: () => {},
});

export default UserContext;
