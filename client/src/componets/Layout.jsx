import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";  // Sidebar component

const Layout = () => {
  return (
    <div className="flex">
      <Sidebar />
        <main className="p-4">
          <Outlet /> 
        </main>
    </div>
  );
};

export default Layout;
