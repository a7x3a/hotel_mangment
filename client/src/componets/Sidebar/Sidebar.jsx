import { useState ,useContext} from 'react';
import {
  IconCalendarStats,
  IconDeviceDesktopAnalytics,
  IconFingerprint,
  IconGauge,
  IconHome2,
  IconLogout,
  IconSettings,
  IconUser,
  IconHexagon,
} from '@tabler/icons-react';
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../utils/routes/users';
import { Center, Stack, Tooltip, UnstyledButton, Loader } from '@mantine/core'; // Added Loader
import classes from './Sidebar.module.css';
import { useCookies } from 'react-cookie';

function NavbarLink({ icon: Icon, label, active, onClick }) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
        <Icon size={20} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome2, label: 'Home' },
  { icon: IconGauge, label: 'Dashboard' },
  { icon: IconDeviceDesktopAnalytics, label: 'Analytics' },
  { icon: IconCalendarStats, label: 'Rooms' },
  { icon: IconUser, label: 'Account' },
  { icon: IconFingerprint, label: 'Security' },
  { icon: IconSettings, label: 'Settings' },
];

export function Sidebar() {
  const [active, setActive] = useState(2);
  const {setUser} = useContext(UserContext); // Assuming you have a UserContext to manage user state
  const [loading, setLoading] = useState(false);  // State for loading spinner
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(['user']);

  const handleLogout = () => {
    setLoading(true);  // Start loading before the API call
    logoutUser()
      .then(() => {
        removeCookie('user');  // Remove user cookie
        setUser(null);  // Update user state in context
        setLoading(false);  // Stop loading after the API call succeeds
        navigate('/login');
        console.log('Logout successful');
      })
      .catch((error) => {
        setLoading(false);  // Stop loading if the API call fails
        console.error('Logout failed:', error);
        // Optionally, show a user-friendly error message here
      });
  };

  return (
    <div className='relative mr-20'>
    <nav className={classes.navbar}>
      <Center>
        <IconHexagon opacity={'90%'} size={25}  color='black' cursor={'Pointer'} />
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={5}>
          {mockdata.map((link, index) => (
            <NavbarLink
              {...link}
              key={link.label}
              active={index === active}
              onClick={() => setActive(index)}
            />
          ))}
        </Stack>
      </div>

      <Stack justify="center" gap={5}>
        <NavbarLink icon={IconLogout} label="Logout" onClick={handleLogout} />
      </Stack>

      {/* Optional Loading Spinner */}
      {loading && (
        <Center>
          <Loader />
        </Center>
      )}
    </nav>
    </div>
  );
}
