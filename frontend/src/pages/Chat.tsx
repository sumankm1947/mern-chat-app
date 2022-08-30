import { Box } from "@chakra-ui/react";
import { Fragment, useState } from "react";
import ChatBox from "../components/chat/ChatBox";
import Header from "../components/chat/Header";
import MyChats from "../components/chat/MyChats";

const Chat = () => {
  const [doFetchChats, setDoFetchChats] = useState(false);
  return (
    <Fragment>
      <Header />
      <Box display="flex" flexDirection="row" width="100%">
        <MyChats doFetchChats={doFetchChats}/>
        <ChatBox setDoFetchChats={setDoFetchChats} />
      </Box>
    </Fragment>
  );
};

export default Chat;
