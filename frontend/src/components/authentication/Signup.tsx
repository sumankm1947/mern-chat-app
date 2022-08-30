import React, { useState, useContext } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

import UserContext from "../../context/userContext";
import { AuthProps, UserActionType } from "../../utils/types";

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
  Text,
  Link,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = ({ setSignupOrLogin }: AuthProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState<File>();

  const toast = useToast();
  const navigate = useNavigate();

  const { dispatch: dispatchUser } = useContext(UserContext);

  const singupHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === "" || email.trim() === "" || password.trim() === "") {
      return toast({
        title: "Error",
        description: "Please fill all the fields",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    if (password.trim() !== confirmPassword.trim()) {
      return toast({
        title: "Error",
        description: "Passwords do not match",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    // Upload the avatar in cloudinary
    let url: String = "";
    try {
      setIsLoading(true);
      if (avatar?.type === "image/jpeg" || avatar?.type === "image/png") {
        const formData = new FormData();
        formData.append("file", avatar);
        formData.append("upload_preset", "gossip");
        formData.append("cloud_name", "superbsuman");

        const { data } = await axios.post(
          `https://api.cloudinary.com/v1_1/superbsuman/image/upload`,
          formData
        );
        url = data.secure_url;
      }

      // Make the signup request to the server
      const { data } = await axios.post("/api/v1/user/signup", {
        name,
        email,
        password,
        avatar: url === "" ? null : url,
        confirmPassword,
      });

      // DISPATCH
      dispatchUser({ type: UserActionType.SET_USER, payload: data });

      // console.log(state.user);

      setIsLoading(false);
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chat", { replace: true });
      return toast({
        title: "Success",
        description: "You have successfully signed up",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
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
        paddingTop="20px"
        paddingBottom="40px"
        borderRadius={8}
        boxShadow="lg"
      >
        <Box textAlign="center">
          <Heading>Signup</Heading>
        </Box>
        <Box>
          <form onSubmit={singupHandler}>
            <FormControl mt="4">
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                type="text"
                id="name"
                placeholder="Tester"
                value={name}
                onChange={(e: React.FormEvent<HTMLInputElement>) =>
                  setName(e.currentTarget.value)
                }
              />
            </FormControl>
            <FormControl mt="4">
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                type="email"
                id="email"
                placeholder="test@test.com"
                value={email}
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
                  value={password}
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
            <FormControl mt="4">
              <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
              <InputGroup>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="123456"
                  value={confirmPassword}
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    setConfirmPassword(e.currentTarget.value)
                  }
                />

                <InputRightElement>
                  <IconButton
                    aria-label="Toggle confirm password visibility"
                    h="1.75rem"
                    size="sm"
                    onClick={() => {
                      setShowConfirmPassword((prev) => !prev);
                    }}
                    icon={
                      showConfirmPassword ? (
                        <AiFillEyeInvisible />
                      ) : (
                        <AiFillEye />
                      )
                    }
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl mt="4" id="pic">
              <FormLabel>Upload your Picture</FormLabel>
              <Input
                type="file"
                p={1}
                accept="image/*"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const fileList = e.target.files;
                  if (!fileList) return;
                  setAvatar(fileList[0]);
                }}
              />
            </FormControl>
            <Button
              isLoading={isLoading}
              width="full"
              type="submit"
              bgColor="teal"
              mt={10}
              mb={5}
            >
              Sign Up
            </Button>
          </form>
          <Box display="flex" justifyContent="flex-end" flexDirection="row">
            <Text marginInline="10px">Already have an account?</Text>
            <Link
              color="teal"
              onClick={() => {
                setSignupOrLogin("login");
              }}
            >
              Login
            </Link>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};

export default Signup;
