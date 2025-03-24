import React, { useContext } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";

import {
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
  H1Icon,
} from "@heroicons/react/24/solid";
import { logoutUser } from "../utils/routes/users";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
const Sidebar = () => {
  const [open, setOpen] = React.useState(0);
  const [openAlert, setOpenAlert] = React.useState(true);
  const navigate = useNavigate();
  const {setUser} = useContext(UserContext);
  const handleLogout = () => { 
    logoutUser();
    setUser(null); 
    localStorage.setItem("user", null);
    navigate("/login");
   
  }
  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };
  return (
    <div className="h-[calc(100dvh)] flex flex-col  w-1/3 bg-blue-600 text-white max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
      <div className="mb-2 p-4">
        <Typography variant="h5" color="blue-gray">
          Ahmad
        </Typography>
        <H1Icon className="h-10 w-10 text-blue-gray" />
      </div>
      <List className="flex flex-col ">

        <ListItem className="hover:opacity-50 gap-2">
          <ListItemPrefix>
            <InboxIcon className="h-5 w-5" />
          </ListItemPrefix>
          Available Rooms
        </ListItem>
        <ListItem className="hover:opacity-50 gap-2">
          <ListItemPrefix>
            <UserCircleIcon className="h-5 w-5" />
          </ListItemPrefix>
          Guests
        </ListItem>
        <ListItem className="hover:opacity-50 gap-2">
          <ListItemPrefix>
            <Cog6ToothIcon className="h-5 w-5" />
          </ListItemPrefix>
          Reservations
        </ListItem>
        <ListItem className="hover:opacity-50 gap-2">
          <ListItemPrefix>
            <PowerIcon className="h-5 w-5" />
          </ListItemPrefix>
          Reports
        </ListItem>

      </List>
      <ListItem onClick={()=>{handleLogout()}} className="hover:opacity-50 gap-2 justify-self-end mt-auto">
        <ListItemPrefix>
          <PowerIcon className="h-5 w-5" />
        </ListItemPrefix>
        Log Out
      </ListItem>
    </div>
  )
}

export default Sidebar