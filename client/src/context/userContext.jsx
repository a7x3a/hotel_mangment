// context/userContext.js
import { createContext, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (cookies.user) {
      setUser(cookies.user.user);
      setToken(cookies.user.token);
      if (cookies.user.remember) {
        localStorage.setItem('token', cookies.user.token);
      } else {
        sessionStorage.setItem('token', cookies.user.token);
      }
    }
  }, []);

  const updateUser = (userData, token, remember = false) => {
    setUser(userData);
    setToken(token);
    const options = remember ? { maxAge: 60 * 60 * 24 } : {};
    setCookie('user', { user: userData, token, remember }, options);
    if (remember) {
      localStorage.setItem('token', token);
      sessionStorage.removeItem('token');
    } else {
      sessionStorage.setItem('token', token);
      localStorage.removeItem('token');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    removeCookie('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  };

  return (
    <UserContext.Provider value={{ user, token, setUser: updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};