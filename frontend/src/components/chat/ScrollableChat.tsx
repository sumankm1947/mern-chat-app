import { useContext, useRef, useEffect } from "react";

import { Avatar, Box, Flex, Text, Tooltip } from "@chakra-ui/react";
import {
  isLastMessageFromAUser,
  isSameUser,
  messageSenderMargin,
} from "../../utils/chat";
import { Message } from "../../utils/types";
import UserContext from "../../context/userContext";
import "../../index.css";

const AlwaysScrollToBottom = ({ messages }: Props) => {
  const elementRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  useEffect(() => {
    elementRef.current?.scrollIntoView();
  }, [messages]);
  return <div ref={elementRef} />;
};

type Props = {
  messages: Message[];
};
const ScrollableChat = ({ messages }: Props) => {
  const { state: userState } = useContext(UserContext);

  return (
    <Box>
      {messages.map((message, index) => (
        <Flex
          justify={`${messageSenderMargin(message, userState.user?._id)}`}
          key={message._id}
        >
          {isLastMessageFromAUser(messages, message, index) &&
            !isSameUser(message, userState.user?._id) && (
              <Tooltip
                label={message.sender.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={message.sender.name}
                  src={message.sender.avatar}
                />
              </Tooltip>
            )}
          <Box
            bgColor={
              isSameUser(message, userState.user?._id)
                ? "green.200"
                : "blue.200"
            }
            borderRadius={5}
            color="black"
            marginLeft={
              !isLastMessageFromAUser(messages, message, index) &&
              !isSameUser(message, userState.user?._id)
                ? 9
                : "0px"
            }
            fontSize="sm"
            maxWidth="90%"
            fontFamily="body"
            fontWeight="medium"
            marginBlock={
              isLastMessageFromAUser(messages, message, index) ? 3 : 1
            }
          >
            <Text
              wordBreak="break-all"
              padding="4px 10px"
            >
              {message.message}
            </Text>
          </Box>
        </Flex>
      ))}
      <AlwaysScrollToBottom messages={messages} />
    </Box>
  );
};

export default ScrollableChat;
