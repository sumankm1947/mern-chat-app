import { useContext, useState, useEffect, useCallback } from "react";
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
import { io, Socket } from "socket.io-client";
import ChatContext from "../../context/chatContext";
import UserContext from "../../context/userContext";
import { AiOutlineSend } from "react-icons/ai";
import ViewChatDetails from "./ViewChatDetails";
import axios from "axios";
import { Chat, ChatActionType, Message, User } from "../../utils/types";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../../utils/typing.json";

interface ServerToClientEvents {
  connected: () => void;
  message_received: (message: Message) => void;
  typing: () => void;
  stop_typing: () => void;
}

interface ClientToServerEvents {
  setup: (user: User | null) => void;
  join_chat: (room: string | undefined) => void;
  new_message: (message: Message) => void;
  typing: (roomId: string | undefined) => void;
  stop_typing: (roomId: string | undefined) => void;
}

let socket: Socket<ServerToClientEvents, ClientToServerEvents>;
let selectedChatCompare: Chat | null;
const ENDPOINT = "http://localhost:5000/"

type Props = {
  setDoFetchChats: React.Dispatch<React.SetStateAction<boolean>>;
};

const SingleChat = ({ setDoFetchChats }: Props) => {
  const { state: chatState, dispatch: dispatchChat } = useContext(ChatContext);
  const { state: userState } = useContext(UserContext);

  const bg = useColorModeValue("gray.200", "gray.700");
  const toast = useToast();

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT);
  }, []);

  useEffect(() => {
    if (!userState.user) return;

    socket.emit("setup", userState?.user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop_typing", () => setIsTyping(false));
  }, [userState.user]);

  const fetchMessages = useCallback(async () => {
    if (!chatState.selectedChat) return;
    try {
      setIsLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userState.user?.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/v1/message/${chatState.selectedChat?._id}`,
        config
      );
      setIsLoading(false);
      setMessages(data);

      socket.emit("join_chat", chatState.selectedChat?._id);
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: "Error Occured!",
        // description: error.response.data.message,
        description: "Error occured",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    }
  }, [chatState.selectedChat, userState.user, toast]);

  // const fetchMessages = ;

  useEffect(() => {
    if (chatState.selectedChat) {
      fetchMessages();
      selectedChatCompare = chatState.selectedChat;
    }
  }, [chatState.selectedChat, userState.user, toast, fetchMessages]);

  useEffect(() => {
    const exist = socket.hasListeners("message_received");
    if (exist) return;

    socket?.once("message_received", function (message: Message) {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== message.chat._id
        // if chat is not selected or doesn't match current chat
      ) {
        dispatchChat({
          type: ChatActionType.SET_NOTIFICATION,
          payload: message,
        });
        setDoFetchChats((prev) => (prev ? false : true));
      } else {
        setMessages((prev) => [...prev, message]);
      }
    });
  });

  const sendMessageHandler = async () => {
    try {
      socket.emit("stop_typing", chatState.selectedChat?._id);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userState.user?.token}`,
        },
      };

      setNewMessage("");
      const { data } = await axios.post(
        "/api/v1/message",
        {
          message: newMessage,
          chatId: chatState.selectedChat?._id,
        },
        config
      );

      setMessages((prev) => [...prev, data]);
      socket.emit("new_message", data);
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

  const typingHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setNewMessage(e.currentTarget.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", chatState.selectedChat?._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 1000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop_typing", chatState.selectedChat?._id);
        setTyping(false);
      }
    }, timerLength);
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
      {isTyping ? (
        <Box position="absolute" bottom="55px" left="20px">
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: animationData,
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
              },
            }}
            width={70}
            style={{ marginBottom: 15, marginLeft: 0 }}
          />
        </Box>
      ) : (
        <></>
      )}
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
              onChange={typingHandler}
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
