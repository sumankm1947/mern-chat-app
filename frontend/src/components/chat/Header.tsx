import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { Fragment, useContext } from "react";
import { AiOutlineDown, AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import ChatContext from "../../context/chatContext";
import UserContext from "../../context/userContext";
import { ChatActionType, Message, UserActionType } from "../../utils/types";
import ProfileModal from "../user/ProfileModal";
import SideDrawer from "./SideDrawer";

const Header = () => {
  const { state: userState, dispatch: dispatchUser } = useContext(UserContext);
  const { state: chatState, dispatch: dispatchChat } = useContext(ChatContext);
  const {
    isOpen: isOpenSideDrawer,
    onOpen: onOpenSideDrawer,
    onClose: onCloseSideDrawer,
  } = useDisclosure();
  const {
    isOpen: isOpenNoti,
    onOpen: onOpenNoti,
    onClose: onCloseNoti,
  } = useDisclosure();
  const { toggleColorMode } = useColorMode();

  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    dispatchUser({ type: UserActionType.REMOVE_USER });
    navigate("/");
  };

  const clearNotificationsHandler = () => {
    dispatchChat({ type: ChatActionType.CLEAR_NOTIFICATIONS });
    onCloseNoti();
  };

  const goToChatHandler = (msg: Message) => {
    dispatchChat({ type: ChatActionType.SET_SELECTED_CHAT, payload: msg.chat });
    dispatchChat({ type: ChatActionType.REMOVE_NOTIFICATION, payload: msg})
    onCloseNoti();
  };

  return (
    <Fragment>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        width="95%"
        height="65px"
        paddingX="20px"
      >
        <Box>
          <Button onClick={onOpenSideDrawer}>
            <AiOutlineSearch color="teal" size="25px" />
            <Text px="3">Search User</Text>
          </Button>
        </Box>
        <Text
          display={{ base: "none", md: "block" }}
          fontStyle="italic"
          fontSize="xl"
        >
          GOSSIP
        </Text>
        <Menu>
          <MenuButton as={Button} rightIcon={<AiOutlineDown color="teal" />}>
            <Avatar
              size="sm"
              name={userState.user?.name}
              cursor="pointer"
              src={userState.user?.avatar}
            />
          </MenuButton>
          <MenuList>
            <MenuItem>
              <ProfileModal>My Profile</ProfileModal>
            </MenuItem>
            <MenuItem>
              <Text onClick={onOpenNoti} width="100%">
                Notifications
              </Text>
              <Modal
                isOpen={isOpenNoti}
                onClose={onCloseNoti}
                blockScrollOnMount={false}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Notifications</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    {chatState.notifications?.length > 0 ? (
                      <>
                        {chatState.notifications?.map((noti) => (
                          <Text
                            key={noti._id}
                            onClick={() => goToChatHandler(noti)}
                          >
                            Ypu have received a message from {noti.sender.name}
                          </Text>
                        ))}
                      </>
                    ) : (
                      <Text>No Notifications</Text>
                    )}
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      colorScheme="teal"
                      mr={3}
                      onClick={clearNotificationsHandler}
                    >
                      Clear all
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </MenuItem>
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            <MenuItem
              onClick={toggleColorMode}
              display={{ base: "flex", md: "none" }}
            >
              Change theme
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
      <SideDrawer isOpen={isOpenSideDrawer} onClose={onCloseSideDrawer} />
    </Fragment>
  );
};

export default Header;
