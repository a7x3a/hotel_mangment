import React, { useContext, useRef ,useState} from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { loginUser } from "../../utils/routes/users";
import {
  Anchor,
  Button,
  Checkbox,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
  Notification,
  Loader
} from '@mantine/core';
import { useCookies } from 'react-cookie';
import classes from './Login.module.css';

const Login = () => {
  const { setUser } = useContext(UserContext);
  const [cookies, setCookie] = useCookies(['session_token']);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Using refs instead of useState
  const usernameRef = useRef();
  const passwordRef = useRef();
  const rememberRef = useRef();
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await loginUser(
        usernameRef.current.value, 
        passwordRef.current.value
      );
      
      // Update user context
      const userData = {
        id: response.user.id,
        name: response.user.name,
        username: response.user.username,
        role: response.user.role
      };
      
      setUser(userData);
      
      // Handle "remember me" if needed
      if (rememberRef.current.checked) {
        // Optionally extend cookie duration
      }
      
      // Redirect based on role
      switch(userData.role) {
        case 'Admin':
          navigate('/admin/dashboard');
          break;
        case 'Cashier':
          navigate('/cashier');
          break;
        default:
          navigate('/');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setError(error?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.wrapper}>
      <Paper component="form" onSubmit={handleSubmit} className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          Hotel Management System
        </Title>

        {error && (
          <Notification color="red" onClose={() => setError(null)} mb="md">
            {error}
          </Notification>
        )}

        <TextInput
          name="username"
          label="Username"
          placeholder="Enter your username"
          ref={usernameRef}
          required
          size="md"
          autoComplete="username"
        />
        
        <PasswordInput
          name="password"
          label="Password"
          placeholder="Your password"
          ref={passwordRef}
          required
          mt="md"
          size="md"
          autoComplete="current-password"
        />
        
        <Checkbox
          name="remember"
          label="Keep me logged in"
          ref={rememberRef}
          mt="xl"
          size="md"
        />
        
        <Button 
          type="submit" 
          fullWidth 
          mt="xl" 
          size="md"
          disabled={loading}
        >
          {loading ? <Loader size="sm" /> : 'Login'}
        </Button>
      </Paper>
    </div>
  );
};

export default Login;