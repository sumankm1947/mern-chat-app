import { Fragment, useContext, useState } from "react";

import {
  Avatar,
  Badge,
  Box,
  Button,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import ChatContext from "../../context/chatContext";
import { getSender, isAdmin } from "../../utils/user";
import UserContext from "../../context/userContext";
import { ChatActionType, User } from "../../utils/types";
import axios from "axios";
import UserListItem from "../user/UserListItem";
import UserBadgeItem from "../user/UserBadgeItem";

const ViewChatDetails = () => {
  const { state: chatState, dispatch: dispatchChat } = useContext(ChatContext);
  const { state: userState } = useContext(UserContext);
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const otherUser = getSender(
    userState.user,
    chatState.selectedChat?.users as User[]
  );

  const {
    isOpen: isOpenDetails,
    onOpen: onOpenDetails,
    onClose: onCloseDetails,
  } = useDisclosure();
  const {
    isOpen: isOpenAddMember,
    onOpen: onOpenAddMember,
    onClose: onCloseAddMember,
  } = useDisclosure();

  const exitGroupHandler = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userState.user?.token}`,
      },
    };

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/chat/exit`,
        {
          chatId: chatState.selectedChat?._id,
        },
        config
      );

      dispatchChat({ type: ChatActionType.SET_SELECTED_CHAT, payload: null });
      toast({
        title: "Chat exited",
        description: data.message,
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      dispatchChat({ type: ChatActionType.SET_CHATS, payload: data.chats });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

    onCloseDetails();
  };

  const searchHandler = async (search: String) => {
    if (search.trim() === "") return;
    try {
      setIsLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userState.user?.token}`,
        },
      };

      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/user?search=${search.trim()}`,
        config
      );
      //   console.log(data);
      setSearchResults(data);
      setIsLoading(false);
    } catch (error: any) {
      toast({
        title: "Error while searching",
        description: error.response.data.message,
        status: "error",
        isClosable: true,
        duration: 3000,
      });
    }
  };

  const addUserHandler = (user: User) => {
    if (selectedUsers.includes(user)) {
      toast({
        title: "User already exists",
        status: "error",
        isClosable: true,
        position: "bottom",
        duration: 2000,
      });
      return;
    }

    setSelectedUsers((prev) => [...prev, user]);
  };

  const removeUserHandler = (user: User) => {
    if (!selectedUsers.includes(user)) {
      toast({
        title: "User doest not exists",
        status: "error",
        isClosable: true,
        position: "bottom",
        duration: 2000,
      });
      return;
    }

    setSelectedUsers((prev) => prev.filter((x) => x._id !== user._id));
  };

  const addUsersToGrpHandler = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userState.user?.token}`,
        },
      };

      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/chat/add`,
        {
          chatId: chatState.selectedChat?._id,
          userIds: selectedUsers.map((user) => user._id),
        },
        config
      );

      dispatchChat({ type: ChatActionType.SET_SELECTED_CHAT, payload: data });
    } catch (error: any) {
      toast({
        title: error.response.data.message,
        status: "error",
        isClosable: true,
        position: "bottom",
        duration: 5000,
      });
    }

    onCloseAddMember();
  };

  return (
    <Fragment>
      {chatState.selectedChat?.isGroup ? (
        <>
          <Button onClick={onOpenDetails}>
            <Avatar
              size="sm"
              name={chatState.selectedChat?.name}
              cursor="pointer"
            />
          </Button>
          <Modal isOpen={isOpenDetails} onClose={onCloseDetails}>
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
                {isAdmin(userState.user, chatState.selectedChat) && (
                  <Fragment>
                    <Button
                      colorScheme="teal"
                      mr={3}
                      onClick={() => {
                        onCloseDetails();
                        onOpenAddMember();
                      }}
                    >
                      Add member
                    </Button>
                  </Fragment>
                )}
                <Button colorScheme="red" mr={3} onClick={exitGroupHandler}>
                  Exit Group
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Modal
            isOpen={isOpenAddMember}
            onClose={onCloseAddMember}
            blockScrollOnMount={false}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add Member</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl marginBlock={3}>
                  <Input
                    placeholder="Add Users..."
                    onChange={(e: React.FormEvent<HTMLInputElement>) =>
                      searchHandler(e.currentTarget.value)
                    }
                  />
                </FormControl>

                {/* USERS TO BE ADDED */}
                <Box display="flex" flexWrap="wrap">
                  {selectedUsers?.map((user) => (
                    <UserBadgeItem
                      key={user._id}
                      user={user}
                      clickHandler={removeUserHandler}
                    />
                  ))}
                </Box>

                {/* SEARCH RESULTS */}
                <Stack overflowY="scroll">
                  {isLoading ? (
                    <Text>Loading...</Text>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((user) => (
                      <UserListItem
                        user={user}
                        key={user._id}
                        accessChat={addUserHandler}
                      />
                    ))
                  ) : (
                    <Text>No results found...</Text>
                  )}
                </Stack>
              </ModalBody>

              <ModalFooter>
                <Button
                  colorScheme="teal"
                  mr={3}
                  onClick={addUsersToGrpHandler}
                >
                  Add
                </Button>
                <Button colorScheme="red" mr={3} onClick={onCloseAddMember}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      ) : (
        <Fragment>
          <Button onClick={onOpenDetails}>
            <Avatar
              size="sm"
              name={otherUser.name}
              cursor="pointer"
              src={otherUser.avatar}
            />
          </Button>
          <Modal isOpen={isOpenDetails} onClose={onCloseDetails}>
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
              <ModalBody
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <Image
                  borderRadius="full"
                  boxSize="150px"
                  src={otherUser.avatar}
                  alt={otherUser.name}
                />
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="teal" mr={3} onClick={onCloseDetails}>
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
