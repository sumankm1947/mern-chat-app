import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { Fragment, useContext, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import ChatContext from "../../context/chatContext";
import UserContext from "../../context/userContext";
import { ChatActionType, User } from "../../utils/types";
import UserBadgeItem from "../user/UserBadgeItem";
import UserListItem from "../user/UserListItem";

const GroupChatModal = () => {
  const { state: userState } = useContext(UserContext);
  const { dispatch: dispatchChat } = useContext(ChatContext);

  const [grpName, setGrpName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const toast = useToast();

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

  const createGroupHandler = async () => {
    if (grpName.trim() === "") {
      toast({
        title: "Group Name is required",
        status: "error",
        isClosable: true,
        position: "bottom",
        duration: 2000,
      });
      return;
    }

    if (selectedUsers.length < 2) {
      toast({
        title: "Group must contain at least three users",
        status: "error",
        isClosable: true,
        position: "bottom",
        duration: 2000,
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userState.user?.token}`,
        },
      };

      console.log(
        config,
        selectedUsers.map((u) => u._id)
      );

      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/chat/group`,
        {
          name: grpName,
          users: selectedUsers?.map((u) => u._id),
        },
        config
      );
      console.log(data);
      onClose();

      dispatchChat({ type: ChatActionType.APPEND_CHAT, payload: data });
    } catch (error: any) {
      toast({
        title: error.response.data.message,
        status: "error",
        isClosable: true,
        position: "bottom",
        duration: 5000,
      });
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Fragment>
      <Button
        display="flex"
        fontSize={{ base: "10px", sm: "17px", md: "10px", lg: "12px" }}
        rightIcon={<AiOutlinePlus />}
        onClick={onOpen}
      >
        New Group Chat
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a group</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Input
                placeholder="Group Name"
                value={grpName}
                type="text"
                onChange={(e: React.FormEvent<HTMLInputElement>) =>
                  setGrpName(e.currentTarget.value)
                }
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users..."
                onChange={(e: React.FormEvent<HTMLInputElement>) =>
                  searchHandler(e.currentTarget.value)
                }
              />
            </FormControl>

            {/* GROUP MEMBERS */}
            <Box display="flex" flexWrap="wrap">
              {selectedUsers?.map((user) => (
                <UserBadgeItem key={user._id} user={user} />
              ))}
            </Box>

            {/* SEARCH RESULTS */}
            <Box>
              {isLoading ? (
                <Text>Loading...</Text>
              ) : (
                searchResults
                  ?.slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      user={user}
                      key={user._id}
                      accessChat={addUserHandler}
                    />
                  ))
              )}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={createGroupHandler}>
              Create group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Fragment>
  );
};

export default GroupChatModal;
