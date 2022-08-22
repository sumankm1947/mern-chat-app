import { Avatar, Box, Text, useColorModeValue } from "@chakra-ui/react";
import { User } from "../../utils/types";

type Props = {
  user: User;
  accessChat: (userId: string) => Promise<void>;
};

const UserListItem = ({ user, accessChat }: Props) => {
  const bg = useColorModeValue("gray.200", "gray.600");

  return (
    <Box
      margin={1}
      cursor="pointer"
      bg={bg}
      _hover={{
        background: "teal",
        color: "white",
      }}
      width="100%"
      display="flex"
      alignItems="center"
      px={3}
      py={2}
      borderRadius="lg"
      onClick={() => accessChat(user._id)}
    >
      <Avatar name={user.name} src={user.avatar} cursor="pointer" size="sm" />
      <Text marginInline={2}>{user.name}</Text>
    </Box>
  );
};

export default UserListItem;
