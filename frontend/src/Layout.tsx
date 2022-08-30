import { Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat";
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";

const Layout = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
      {/* 404 */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default Layout;
