import { Outlet } from "react-router-dom";
import {Sidebar} from "./Sidebar/Sidebar";  // Sidebar component

const Layout = () => {
  return (
    <div className="w-full flex">
           <Sidebar />
        <main className="w-full h-fit  overflow-x-visible" > 
          <Outlet /> 
        </main>
    </div>
  );
};

export default Layout;
