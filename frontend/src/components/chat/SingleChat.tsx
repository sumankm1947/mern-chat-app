import { useContext, useState, useEffect } from "react";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import ChatContext from "../../context/chatContext";
import UserContext from "../../context/userContext";
import { AiOutlineSend } from "react-icons/ai";
import ViewChatDetails from "./ViewChatDetails";
import axios from "axios";
import { Message } from "../../utils/types";
import ScrollableChat from "./ScrollableChat";

const SingleChat = () => {
  const { state: chatState } = useContext(ChatContext);
  const { state: userState } = useContext(UserContext);

  const bg = useColorModeValue("gray.200", "gray.700");
  const toast = useToast();

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${userState.user?.token}`,
          },
        };
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/message/${chatState.selectedChat?._id}`,
          config
        );
        setIsLoading(false);
        setMessages(data);
      } catch (error: any) {
        setIsLoading(false);
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "bottom",
        });
      }
    };
    if (chatState.selectedChat) fetchMessages();
  }, [chatState.selectedChat, userState.user, toast]);

  const sendMessageHandler = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userState.user?.token}`,
        },
      };

      setNewMessage("");
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/message`,
        {
          message: newMessage,
          chatId: chatState.selectedChat?._id,
        },
        config
      );

      setMessages((prev) => [...prev, data]);
    } catch (error: any) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return chatState.selectedChat ? (
    <Box height="100%" width="100%">
      <Box position="absolute" top={3} right={3}>
        <ViewChatDetails />
      </Box>
      <Box
        bgColor={bg}
        width="100%"
        height="83%"
        overflowY="scroll"
        marginTop={12}
        marginBottom={2}
        borderRadius={5}
        padding={4}
      >
        {isLoading ? (
          <Spinner size="xl" w={20} h={20} display="block" margin="auto" />
        ) : (
          <ScrollableChat messages={messages} />
        )}
      </Box>
      <Box width="100%">
        <FormControl
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key !== "Enter") return;
            sendMessageHandler();
          }}
        >
          <InputGroup>
            <Input
              width="100%"
              value={newMessage}
              placeholder="Enter Message"
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                setNewMessage(e.currentTarget.value)
              }
            />
            <InputRightElement>
              <IconButton
                aria-label="Send message"
                size="sm"
                icon={<AiOutlineSend />}
                onClick={sendMessageHandler}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>
      </Box>
    </Box>
  ) : (
    <Box display="flex" alignItems="center" justifyContent="center" h="100%">
      <Text fontSize="3xl" pb={3}>
        Click on a user to start chatting
      </Text>
    </Box>
  );
};

export default SingleChat;
