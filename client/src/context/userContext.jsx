// context/userContext.js
import { createContext, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const [user, setUser] = useState(null);

  // Initialize user from cookies on first load
  useEffect(() => {
    if (cookies.user) {
      setUser(cookies.user);
    }
  }, []);

  const updateUser = (userData, remember = false) => {
    setUser(userData);
    // Set cookie with expiration (7 days if remember, session otherwise)
    const options = remember ? { maxAge: 60 * 60 * 24 * 7 } : {};
    setCookie('user', userData, options);
  };

  const logout = () => {
    setUser(null);
    removeCookie('user');
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};