import { useColorMode, Box, IconButton } from "@chakra-ui/react";
import {BsFillSunFill, BsFillMoonFill} from "react-icons/bs"

export default function ThemeToggler() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box
      textAlign="right"
      position="absolute"
      top={3}
      right={3}
      zIndex="100"
      display={{ base: "none", md: "block" }}
    >
      <IconButton
        aria-label={colorMode === "light" ? "Dark Theme" : "Light Theme"}
        icon={colorMode === "light" ? <BsFillMoonFill /> : <BsFillSunFill />}
        onClick={toggleColorMode}
        variant="ghost"
      />
    </Box>
  );
}
