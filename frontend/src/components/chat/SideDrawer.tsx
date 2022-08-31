import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useState } from "react";
import ChatContext from "../../context/chatContext";
import UserContext from "../../context/userContext";
import { ChatActionType, User } from "../../utils/types";
import UserListSkeleton from "../loader/UserListSkeleton";
import UserListItem from "../user/UserListItem";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const SideDrawer = ({ isOpen, onClose }: Props) => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const toast = useToast();
  const { state: userState } = useContext(UserContext);
  const { dispatch: dispatchChat } = useContext(ChatContext);

  const searchHandler = async () => {
    if (search.trim() === "") {
      return toast({
        title: "Error",
        description: "Please enter a search term",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }

    try {
      setIsLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userState.user?.token}`,
        },
      };

      const { data } = await axios(
        `/user?search=${search}`,
        config
      );
      setSearchResults(data);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const accessChat = async (user: User) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userState.user?.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/v1/chat",
        { userId: user._id },
        config
      );

      dispatchChat({ type: ChatActionType.SET_SELECTED_CHAT, payload: data });
      dispatchChat({ type: ChatActionType.APPEND_CHAT, payload: data });
      setLoadingChat(false);
      // console.log(data);

      onClose();
    } catch (error: any) {
      toast({
        title: "Error fetching the chat",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose} blockScrollOnMount={false}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Search User</DrawerHeader>

        <DrawerBody>
          <InputGroup>
            <Input
              placeholder="Type here..."
              value={search}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                setSearch(e.currentTarget.value)
              }
            />
            <InputRightElement>
              <Button size="sm" width="1.75rem" onClick={searchHandler}>
                Go
              </Button>
            </InputRightElement>
          </InputGroup>
          {isLoading ? (
            <UserListSkeleton />
          ) : (
            <Box
              width="100%"
              display="flex"
              flexDirection="column"
              alignItems="center"
              overflowY="scroll"
              overflowX="hidden"
              paddingBlock={2}
            >
              {searchResults.length > 0 ? (
                searchResults.map((user: User) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    accessChat={accessChat}
                  />
                ))
              ) : (
                <Box>No results found</Box>
              )}
            </Box>
          )}
          {loadingChat && <Spinner ml="auto" display="flex" />}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SideDrawer;
