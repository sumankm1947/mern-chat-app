import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import UserContextProvider from "./context/UserContextProvider";
import ChatContextProvider from "./context/ChatContextProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // <React.StrictMode>
    <ChakraProvider>
      <BrowserRouter>
        <UserContextProvider>
          <ChatContextProvider>
            <App />
          </ChatContextProvider>
        </UserContextProvider>
      </BrowserRouter>
    </ChakraProvider>
  // </React.StrictMode>
);
