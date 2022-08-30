import { useReducer } from "react";
import type {
  ChatContextProviderProps,
  ChatAction,
  ChatState,
} from "../utils/types";
import { ChatActionType } from "../utils/types";
import ChatContext from "./chatContext";

const defaultChat = {
  chats: [],
  selectedChat: null,
  notifications: [],
};

const chatReducer = (state: ChatState, action: ChatAction) => {
  switch (action.type) {
    case ChatActionType.SET_CHATS:
      return {
        ...state,
        chats: action.payload,
      };
    case ChatActionType.SET_SELECTED_CHAT:
      return {
        ...state,
        selectedChat: action.payload,
      };
    case ChatActionType.APPEND_CHAT:
      return {
        ...state,
        chats: [action.payload, ...state.chats],
      };
    case ChatActionType.SET_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
    case ChatActionType.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications?.filter(
          (notification) => notification._id !== action.payload._id
        ),
      };
    case ChatActionType.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
      };

    default:
      return state;
  }
};

const ChatContextProvider = ({ children }: ChatContextProviderProps) => {
  const [chatState, dispatchChat] = useReducer(chatReducer, defaultChat);

  return (
    <ChatContext.Provider value={{ state: chatState, dispatch: dispatchChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;
