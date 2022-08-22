import { createContext } from "react";
import { ChatAction, ChatState } from "../utils/types";


const ChatContext = createContext<{
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
}>({
  state: {
    chats: [],
    selectedChat: null,
  },
  dispatch: () => {},
});

export default ChatContext;
