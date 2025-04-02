import React, { useState, useRef, useContext } from "react";
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
} from '@mantine/core';
import classes from './Login.module.css';
const Login = () => {
  const { setUser } = useContext(UserContext);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const username = usernameRef.current.value;
      const password = passwordRef.current.value;
      const response = await loginUser(username, password);
      // Save user & token to localStorage
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("token", response.token);
      setUser(response.user);
      navigate("/");
    } catch (error) {
      setError(error?.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title  order={2}  className={classes.title} ta="center" mt="md" mb={50}>
          Hotel Management System
        </Title>

        <TextInput ref={usernameRef} label="Email address" placeholder="hello@gmail.com" size="md" />
        <PasswordInput ref={passwordRef} label="Password" placeholder="Your password" mt="md" size="md" />
        <Checkbox label="Keep me logged in" mt="xl" size="md" />
        <Button onClick={handleSubmit} fullWidth mt="xl" size="md">
          Login
        </Button>
      </Paper>
    </div>
  );
};

export default Login;
