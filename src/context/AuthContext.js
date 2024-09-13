import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';  // Fix: import axios for making HTTP requests
import { useNavigate } from 'react-router-dom';  // Fix: import useNavigate for navigation

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // Fix: Declare user and setUser state
  const navigate = useNavigate();  // Fix: useNavigate hook for redirecting after login

  const login = async (email, password) => {
    try {
      const response = await fetch('http://appservice.wuaze.com/login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });
      
      const userData = response.data.user;
  console.log(userData);
      if (!userData || !userData.role) {
        throw new Error('Invalid user data');  // Handle missing user data
      }
  
      // Store user data
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
  
      // Redirect based on role
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Invalid email or password');
    }
  };
  

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');  // Clear user data from localStorage on logout
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
