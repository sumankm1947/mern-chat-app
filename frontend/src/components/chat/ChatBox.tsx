import { Box } from "@chakra-ui/react";
import { BiArrowBack } from "react-icons/bi";
import { useContext } from "react";
import ChatContext from "../../context/chatContext";
import SingleChat from "./SingleChat";
import { ChatActionType } from "../../utils/types";

type Props = {
  setDoFetchChats: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChatBox = ({ setDoFetchChats }: Props) => {
  const { state: chatState, dispatch: dispatchChat } = useContext(ChatContext);

  const goBackToMyChats = () => {
    dispatchChat({ type: ChatActionType.SET_SELECTED_CHAT, payload: null });
  };

  return (
    <Box
      display={{ base: chatState.selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      marginBlock={3}
      marginRight={3}
      marginLeft={{ base: 3, md: 0 }}
      w={{ base: "100%", md: "70%" }}
      borderRadius="lg"
      borderWidth="1px"
      height="88vh"
      position="relative"
    >
      <Box
        position="absolute"
        left={3}
        display={{ base: "flex", md: "none" }}
        height="100%"
      >
        <BiArrowBack size={30} onClick={goBackToMyChats} />
      </Box>
      <SingleChat setDoFetchChats={setDoFetchChats}/>
    </Box>
  );
};

export default ChatBox;
