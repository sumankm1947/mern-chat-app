import { Fragment, useContext } from "react";

import {
  Box,
  Button,
  Flex,
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
import UserContext from "../../context/userContext";

type Props = {
  children: React.ReactNode;
};

const ProfileModal = ({ children }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { state: userState } = useContext(UserContext);
  return (
    <Fragment>
      <Box as="span" width="100%" onClick={onOpen}>
        {children}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} blockScrollOnMount={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontWeight="light" letterSpacing={3}>
            {userState.user?.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image
              alt={userState.user?.name}
              src={userState.user?.avatar}
              borderRadius="full"
              boxSize="300px"
              margin="auto"
              fallbackSrc="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
            />
            <Flex flexDirection="row" alignItems="center" justifyContent="center" >
              <Text marginRight={2} textAlign="center" fontSize="xl">Email:</Text>
              <Text
                textAlign="center"
                fontSize="xl"
                marginBlock={3}
                fontWeight="light"
                letterSpacing={3}
              >
                {userState.user?.email}
              </Text>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Fragment>
  );
};

export default ProfileModal;
