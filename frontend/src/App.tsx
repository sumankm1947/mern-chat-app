import {
  ThemeProvider,
  theme,
  ColorModeProvider,
  CSSReset,
} from "@chakra-ui/react";
import ThemeToggler from "./components/theme/ThemeToggler";
import Layout from "./Layout";
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider>
        <CSSReset />
        <ThemeToggler />
        <Layout />
      </ColorModeProvider>
    </ThemeProvider>
  );
}
