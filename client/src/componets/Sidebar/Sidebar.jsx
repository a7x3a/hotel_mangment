import { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  IconGauge,
  IconBed,
  IconUsers,
  IconCalendar,
  IconCash,
  IconUser,
  IconLogout,
  IconHexagon,
} from '@tabler/icons-react';
import { UserContext } from '../../context/userContext';
import { logoutUser } from '../../utils/routes/users';
import { Center, Stack, Tooltip, UnstyledButton, Loader } from '@mantine/core';
import classes from './Sidebar.module.css';
import { useCookies } from 'react-cookie';

function NavbarLink({ icon: Icon, label, active, path }) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(path);
  };

  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton 
        onClick={handleClick} 
        className={classes.link} 
        data-active={active || undefined}
        aria-label={label}
      >
        <Icon size={20} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

// Admin navigation links
const adminLinks = [
  { icon: IconGauge, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: IconBed, label: 'Rooms', path: '/admin/rooms' },
  { icon: IconUsers, label: 'Cashiers', path: '/admin/users' },
];

// Cashier navigation links
const cashierLinks = [
  { icon: IconGauge, label: 'Dashboard', path: '/cashier/dashboard' },
  { icon: IconUsers, label: 'Guests', path: '/cashier/guests' },
  { icon: IconCalendar, label: 'Reservations', path: '/cashier/reservations' },
  { icon: IconCash, label: 'Payments', path: '/cashier/payments' },
  { icon: IconUser, label: 'Profile', path: '/profile' },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [cookies, , removeCookie] = useCookies(['user']);

  // Get active link based on current route
  const getActiveIndex = (links) => {
    return links.findIndex(link => 
      location.pathname === link.path || 
      (link.path !== '/' && location.pathname.startsWith(`${link.path}/`))
    );
  };

  const links = user?.role === 'Admin' ? adminLinks : cashierLinks;
  const activeIndex = getActiveIndex(links);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      removeCookie('user');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='relative  mr-20'>
      <nav className={classes.navbar}>
        <Center pt={10} >
          <IconHexagon 
            opacity={'90%'} 
            size={24}  
            color='white' 
            cursor={'pointer'} 
            onClick={() => navigate(user?.role === 'Admin' ? '/admin/dashboard' : '/cashier/dashboard')}
            aria-label="Home"
          />
        </Center>

        <div className={classes.navbarMain}>
          <Stack justify="center" gap={5}>
            {links.map((link, index) => (
              <NavbarLink
                {...link}
                key={link.label}
                active={index === activeIndex}
              />
            ))}
          </Stack>
        </div>

        <Stack justify="center" gap={5}>
          <Tooltip label="Logout" position="right" transitionProps={{ duration: 0 }}>
            <UnstyledButton 
              onClick={handleLogout} 
              className={classes.link}
              disabled={loading}
              aria-label="Logout"
            >
              {loading ? <Loader size={20} /> : <IconLogout size={20} stroke={1.5} />}
            </UnstyledButton>
          </Tooltip>
        </Stack>
      </nav>
    </div>
  );
}