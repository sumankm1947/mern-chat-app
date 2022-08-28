import { Badge, Text } from "@chakra-ui/react";
import { AiOutlineClose } from "react-icons/ai";

import { User } from "../../utils/types";

type Props = {
  user: User;
};

const UserBadgeItem = ({ user }: Props) => {
  return (
    <Badge
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      colorScheme="teal"
      cursor="pointer"
      display="flex"
      alignItems="center"
      width="fit-content"
    >
      <Text marginInline={1} textTransform="none" fontSize={12}>{user.name}</Text>
      <AiOutlineClose />
    </Badge>
  );
};

export default UserBadgeItem;
