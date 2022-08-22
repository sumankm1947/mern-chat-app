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
