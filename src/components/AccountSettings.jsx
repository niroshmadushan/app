import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, InputAdornment, IconButton } from '@mui/material';
import { Email as EmailIcon, Visibility, VisibilityOff, Lock as LockIcon, Person as PersonIcon } from '@mui/icons-material';
import Swal from 'sweetalert2';
import axios from 'axios';

const AccountSettings = () => {
  const [accountDetails, setAccountDetails] = useState({
    email: '',
    role: '',
    currentPassword: '',
    password: '',
    confirmPassword: ''
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch user details from local storage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setAccountDetails({
        ...accountDetails,
        email: userData.email,
        role: userData.role
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccountDetails({ ...accountDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate that the new password and confirm password match
    if (accountDetails.password !== accountDetails.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'New passwords do not match!',
      });
      return;
    }
  
    // Check if the current and new passwords are provided
    if (!accountDetails.password || !accountDetails.currentPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Both current and new passwords must be filled!',
      });
      return;
    }
  
    try {
      // Send current password, new password, and email to the backend
      const response = await axios.post('http://localhost/back/update_password.php', {
        email: accountDetails.email,
        currentPassword: accountDetails.currentPassword,
        newPassword: accountDetails.password,
      });
  
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Password updated successfully!',
        });
        setAccountDetails({ ...accountDetails, currentPassword: '', password: '', confirmPassword: '' });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong while updating the password!',
      });
    }
  };
  

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
  const toggleShowCurrentPassword = () => setShowCurrentPassword(!showCurrentPassword);

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Paper sx={{ p: 4, maxWidth: '500px', width: '100%', borderRadius: '8px', backgroundColor: '#ffffff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }} elevation={3}>
        <Typography variant="h5" gutterBottom>
          Account Settings
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={accountDetails.email}
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
              readOnly: true, // Email is read-only
            }}
          />
          <TextField
            fullWidth
            label="Role"
            name="role"
            value={accountDetails.role}
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
              readOnly: true, // Role is read-only
            }}
          />
          <TextField
            fullWidth
            label="Current Password"
            name="currentPassword"
            type={showCurrentPassword ? 'text' : 'password'}
            value={accountDetails.currentPassword}
            onChange={handleChange}
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowCurrentPassword} edge="end">
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="New Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={accountDetails.password}
            onChange={handleChange}
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={accountDetails.confirmPassword}
            onChange={handleChange}
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowConfirmPassword} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Update Password
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AccountSettings;

