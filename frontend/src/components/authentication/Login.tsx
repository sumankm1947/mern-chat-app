import { useState, useContext } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

import { useNavigate } from "react-router-dom";
import {
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  IconButton,
  InputGroup,
  InputRightElement,
  Link,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

import UserContext from "../../context/userContext";
import { AuthProps, UserActionType } from "../../utils/types";

const Login = ({ setSignupOrLogin }: AuthProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const { dispatch: dispatchUser } = useContext(UserContext);
  const navigate = useNavigate();

  const loginHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // console.table({ email, password });

    if (email.trim() === "" || password.trim() === "") {
      return toast({
        title: "Error",
        description: "Please fill all the fields",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    try {
      const { data } = await axios.post(
        `/user/login`,
        {
          email,
          password,
        }
      );

      // Dispatch user state
      dispatchUser({ type: UserActionType.SET_USER, payload: data });

      setIsLoading(false);
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chat", { replace: true });
    } catch (error: any) {
      setIsLoading(false);
      return toast({
        title: "Error",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex width="full" height="100vh" align="center" justifyContent="center">
      <Box
        p={2}
        width={{ base: "400px", md: "450px" }}
        borderWidth={2}
        paddingInline="40px"
        paddingBlock="50px"
        borderRadius={8}
        boxShadow="lg"
      >
        <Box textAlign="center">
          <Heading>Login</Heading>
        </Box>
        <Box>
          <form onSubmit={loginHandler}>
            <FormControl mt="4">
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                type="email"
                id="email"
                placeholder="test@test.com"
                onChange={(e: React.FormEvent<HTMLInputElement>) =>
                  setEmail(e.currentTarget.value)
                }
              />
            </FormControl>
            <FormControl mt="4">
              <FormLabel htmlFor="password">Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="123456"
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    setPassword(e.currentTarget.value)
                  }
                />
                <InputRightElement>
                  <IconButton
                    aria-label="Toggle password visibility"
                    h="1.75rem"
                    size="sm"
                    onClick={() => {
                      setShowPassword((prev) => !prev);
                    }}
                    icon={showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button
              width="full"
              type="submit"
              bgColor="teal"
              mt={10}
              mb={5}
              isLoading={isLoading}
            >
              Login
            </Button>
          </form>
          <Box display="flex" justifyContent="flex-end" flexDirection="row">
            <Text marginInline="10px">New here?</Text>
            <Link
              color="teal"
              onClick={() => {
                setSignupOrLogin("signup");
              }}
            >
              Signup
            </Link>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};

export default Login;
