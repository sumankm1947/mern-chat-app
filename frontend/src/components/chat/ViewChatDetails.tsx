import { Fragment, useContext } from "react";

import {
  Avatar,
  Badge,
  Box,
  Button,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import ChatContext from "../../context/chatContext";
import { getSender } from "../../utils/user";
import UserContext from "../../context/userContext";
import { User } from "../../utils/types";

const ViewChatDetails = () => {
  const { state: chatState } = useContext(ChatContext);
  const { state: userState } = useContext(UserContext);
  const otherUser = getSender(
    userState.user,
    chatState.selectedChat?.users as User[]
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Fragment>
      {chatState.selectedChat?.isGroup ? (
        <>
          <Button onClick={onOpen}>
            <Avatar
              size="sm"
              name={chatState.selectedChat?.name}
              cursor="pointer"
            />
          </Button>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader
                fontWeight="light"
                textAlign="center"
                fontSize="3xl"
                letterSpacing={2}
              >
                {chatState.selectedChat?.name}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text textAlign="center" letterSpacing={3} fontWeight="bold">
                  MEMBERS:
                </Text>
                {chatState.selectedChat?.users.map((user) => (
                  <Box key={user._id} display="flex" marginBlock={2}>
                    <Avatar
                      size="sm"
                      name={user.name}
                      cursor="pointer"
                      src={user.avatar}
                    />
                    <Text marginInline={2}>
                      {user.name}
                      {user._id === chatState.selectedChat?.groupAdmin?._id && (
                        <Badge
                          variant="solid"
                          colorScheme="green"
                          marginInline={2}
                        >
                          ADMIN
                        </Badge>
                      )}
                    </Text>
                  </Box>
                ))}
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="teal" mr={3} onClick={onClose}>
                  Add member
                </Button>
                <Button colorScheme="red" mr={3} onClick={onClose}>
                  Exit Group
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      ) : (
        <Fragment>
          <Button onClick={onOpen}>
            <Avatar
              size="sm"
              name={otherUser.name}
              cursor="pointer"
              src={otherUser.avatar}
            />
          </Button>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader
                fontWeight="light"
                textAlign="center"
                fontSize="3xl"
                letterSpacing={2}
              >
                {otherUser.name}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody display="flex" flexDirection="column" alignItems="center">
                <Image
                  borderRadius="full"
                  boxSize="150px"
                  src={otherUser.avatar}
                  alt={otherUser.name}
                />
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="teal" mr={3} onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ViewChatDetails;
