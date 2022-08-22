import { Box } from "@chakra-ui/react";
import { Fragment } from "react";
import ChatBox from "../components/chat/ChatBox";
import Header from "../components/chat/Header";
import MyChats from "../components/chat/MyChats";

const Chat = () => {
  return (
    <Fragment>
      <Header />
      <Box display="flex" flexDirection="row" width="100%">
        <MyChats />
        <ChatBox />
      </Box>
    </Fragment>
  );
};

export default Chat;
