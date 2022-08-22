import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Fragment, useContext } from "react";
import { AiOutlineDown, AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/userContext";
import { UserActionType } from "../../utils/types";
import SideDrawer from "./SideDrawer";

const Header = () => {
  const { state: userState, dispatch: dispatchUser } = useContext(UserContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    dispatchUser({ type: UserActionType.REMOVE_USER });
    navigate("/");
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
          <Button onClick={onOpen}>
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
            <MenuItem>My Profile</MenuItem>
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Box>
      <SideDrawer isOpen={isOpen} onClose={onClose} />
    </Fragment>
  );
};

export default Header;
