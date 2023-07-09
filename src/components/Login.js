import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import anenGroupLogo from './anengroup.png';
import '../styleComponents/Login.css';

const Login = () => {
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in
    checkLoggedIn();
  }, []);

  async function checkLoggedIn() {
    try {
      const response = await axios.get('https://react-backend-project-4.onrender.com/auth/login');
      const data = response.data;
      if (response.ok) {
        // User is logged in, perform desired action
        console.log('User is already logged in');
      } else {
        // User is not logged in, display error message
        console.log('User is not logged in');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred while checking login status');
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
  
    try {
      const response = await axios.post('https://react-backend-project-4.onrender.com/auth/login', {
        username: loginUsername,
        password: loginPassword
      });
  
      const data = response.data;
  
      if (response.status === 200) {
        // Login successful, perform desired action
        console.log(data.message); // "Successfully logged in"
        navigate('/dashboard'); // Redirect to the dashboard
      } else {
        // Login failed, display error message
        setErrorMessage(data.error);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred during login');
    }
  }

  async function handleRegistration(event) {
    event.preventDefault();

    try {
      const response = await axios.post('https://react-backend-project-4.onrender.com/auth/register', {
        username: registerUsername,
        password: registerPassword
      });

      const data = response.data;

      if (response.ok) {
        // Registration successful, perform desired action
        console.log(data.message);
      } else {
        // Registration failed, display error message
        setErrorMessage(data.error);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred during registration');
    }
  }

  return (
    <div className="login-container">
      <a href="https://www.facebook.com/media/set/?set=a.515909153665081&type=3" target="_blank">
        <img src={anenGroupLogo} alt="AnenGroup Logo" />
      </a>
      <div className="header-form">
        <div className="login-header">Log in</div>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-entry">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
            />
          </div>
          <div className="form-entry">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="form-control login-button">
            Login
          </button>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </form>
      </div>
      <div className="registration-form">
        <div className="registration-header">Register</div>
        <form onSubmit={handleRegistration} className="login-form">
          <div className="form-entry">
            <label htmlFor="register-username">Username:</label>
            <input
              id="register-username"
              type="text"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
            />
          </div>
          <div className="form-entry">
            <label htmlFor="register-password">Password:</label>
            <input
              id="register-password"
              type="password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="form-control login-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;