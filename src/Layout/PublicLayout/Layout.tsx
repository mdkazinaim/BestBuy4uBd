import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ChatWidgets from "@/components/Chat/ChatWidgets";

const Layout: React.FC = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ChatWidgets />
    </div>
  );
};

export default Layout;
