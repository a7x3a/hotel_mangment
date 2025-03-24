import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";  // Sidebar component

const Layout = () => {
  return (
    <div className="w-full h-fit flex">
      <Sidebar />
        <main className="w-full h-[100dvh] p-4 overflow-x-visible" > 
          <Outlet /> 
        </main>
    </div>
  );
};

export default Layout;
