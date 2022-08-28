import {
  Avatar,
  Box,
  Stack,
  Text,
  useToast,
  useColorModeValue,
  useBreakpoint,
} from "@chakra-ui/react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import ChatContext from "../../context/chatContext";
import UserContext from "../../context/userContext";
import { Chat, ChatActionType } from "../../utils/types";
import { getSender } from "../../utils/user";
import GroupChatModal from "./GroupChatModal";

const MyChats = () => {
  const { state: chatState, dispatch: dispatchChat } = useContext(ChatContext);
  const { state: userState } = useContext(UserContext);
  const [textSize, setTextSize] = useState(0);
  const breakPoint = useBreakpoint();
  useEffect(() => {
    if (breakPoint === "base") {
      setTextSize(5);
    } else if (breakPoint === "sm") {
      setTextSize(40);
    } else if (breakPoint === "md") {
      setTextSize(5);
    } else if (breakPoint === "lg") {
      setTextSize(20);
    } else {
      setTextSize(35);
    }
  }, [breakPoint]);

  const bg = useColorModeValue("gray.200", "gray.700");

  const toast = useToast();

  useEffect(() => {
    const fetchChats = async () => {
      if (!userState.user) return;
      // console.log(chatState);

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userState.user?.token}`,
          },
        };

        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/chat`,
          config
        );
        dispatchChat({ type: ChatActionType.SET_CHATS, payload: data });
      } catch (error: any) {
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    };
    fetchChats();
  }, [userState, toast, dispatchChat]);
  // console.log(chatState.chats);

  return (
    <Box
      display={{ base: chatState.selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      m={3}
      w={{ base: "100%", md: "30%" }}
      borderRadius="lg"
      borderWidth="1px"
      height="88vh"
    >
      <Box
        pb={3}
        px={3}
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text
          fontFamily="Work sans"
          fontSize={{ base: "20px", sm: "28px", lg: "20px", xl: "30px" }}
          display={{ base: "block", md: "none", lg: "block" }}
        >
          My Chats
        </Text>
        <GroupChatModal />
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chatState.chats ? (
          <Stack overflowY="scroll">
            {chatState.chats.map((chat: Chat) => {
              const otherUser = getSender(userState.user, chat.users);
              return (
                <Box
                  onClick={() =>
                    dispatchChat({
                      type: ChatActionType.SET_SELECTED_CHAT,
                      payload: chat,
                    })
                  }
                  cursor="pointer"
                  bg={chatState.selectedChat === chat ? "#38B2AC" : bg}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <Avatar
                    name={otherUser.name}
                    src={otherUser.avatar}
                    size="sm"
                  />
                  <Box marginLeft={4}>
                    <Text>{!chat.isGroup ? otherUser.name : chat.name}</Text>
                    {chat.latestMessage && (
                      <Text fontSize="xs">
                        <b>{chat.latestMessage.sender.name} : </b>
                        {chat.latestMessage.message.length > textSize
                          ? chat.latestMessage.message.substring(
                              0,
                              textSize + 1
                            ) + "..."
                          : chat.latestMessage.message}
                      </Text>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <p>Loading....</p>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
