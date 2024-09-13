import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2
import {
  Box, TextField, Button, MenuItem, Switch, FormControlLabel,
  Typography, Paper, Grid, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, InputAdornment
} from '@mui/material';
import { 
  Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon, 
  Person as PersonIcon, AdminPanelSettings as AdminIcon, Email as EmailIcon
} from '@mui/icons-material';

const UserManagement = () => {
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'User' });
  const [editMode, setEditMode] = useState(null); // Track the user being edited
  const [editUser, setEditUser] = useState({}); // Temporary state for editing
  const [users, setUsers] = useState([]); // Ensure it's initialized as an empty array

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost/back/get_users.php');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle input changes for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  // Handle input changes for editable user fields
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  // Handle adding a new user
  const handleAddUser = async () => {
    if (newUser.name && newUser.email) {
      try {
        const response = await axios.post('http://localhost/back/add_user.php', {
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        });
  
        if (response.data.success) {
          // Manually add the new user to the users array
          const newId = users.length + 1; // Generate a new ID for the frontend
          const newUserEntry = {
            id: newId,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            active: true // Assume new users are active
          };
  
          setUsers([...users, newUserEntry]); // Append the new user to the existing users array
  
          Swal.fire({
            title: 'Success!',
            text: 'User added successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
  
          // Reset the form
          setNewUser({ name: '', email: '', role: 'User' });
        } else {
          Swal.fire({
            title: 'Error!',
            text: response.data.message, // Show the email already exists message
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      } catch (error) {
        console.error('Error adding user', error);
        Swal.fire({
          title: 'Error!',
          text: 'There was an error adding the user. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } else {
      Swal.fire({
        title: 'Warning!',
        text: 'Please fill in all the required fields.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  };
  
  // Handle toggling user active status
  const handleToggleActive = async (id, currentStatus) => {
    try {
      const updatedStatus = !currentStatus;
      const updatedUser = users.find(user => user.id === id);
      updatedUser.active = updatedStatus;

      // Send the updated status to the backend
      const response = await axios.post('http://localhost/back/update_user.php', {
        id: id,
        email: updatedUser.email,
        role: updatedUser.role,
        active: updatedStatus
      });

      setUsers(users.map(user => (user.id === id ? { ...user, active: updatedStatus } : user)));

      Swal.fire({
        title: 'Success!',
        text: 'User status updated successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error('Error updating user status', error);
      Swal.fire({
        title: 'Error!',
        text: 'There was an error updating the user status. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  // Handle editing user
  const handleEditUser = (user) => {
    setEditMode(user.id);
    setEditUser(user);
  };

  // Handle saving edited user (updates email, role, and active status)
  const handleSaveEditUser = async (id) => {
    try {
      const response = await axios.post('http://localhost/back/update_user.php', {
        id: id,
        email: editUser.email,
        role: editUser.role,
        active: editUser.active
      });

      if (response.data.success) {
        // Update the specific user in the users array
        setUsers(users.map(user => (user.id === id ? { ...user, ...editUser } : user)));
        setEditMode(null); // Exit edit mode

        Swal.fire({
          title: 'Success!',
          text: 'User updated successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: response.data.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error('Error updating user', error);
      Swal.fire({
        title: 'Error!',
        text: 'There was an error updating the user. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  // Handle cancelling edit mode
  const handleCancelEdit = () => {
    setEditMode(null);
    setEditUser({});
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        User Management
      </Typography>

      {/* Compact form layout with Name, Email, Role, and Add button in one row */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: '8px' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={newUser.name}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              select
              fullWidth
              label="Role"
              name="role"
              value={newUser.role}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
            >
              <MenuItem value="user">
                <PersonIcon sx={{ mr: 1 }} />
                User
              </MenuItem>
              <MenuItem value="admin">
                <AdminIcon sx={{ mr: 1 }} />
                Admin
              </MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleAddUser}
              fullWidth
              sx={{ height: '40px' }} // Ensures button height matches text fields
            >
              Add User
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Table to display user data with inline active status toggle and editable fields */}
      <TableContainer component={Paper} sx={{ borderRadius: '8px' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1976d2', height: '40px' }}> {/* Set fixed height for header */}
              <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', padding: '8px' }}>ID</TableCell>
              <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', padding: '8px' }}>Email</TableCell>
              <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', padding: '8px' }}>Role</TableCell>
              <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', padding: '8px' }}>Active Status</TableCell>
              <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', padding: '8px' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow 
                key={user.id} 
                sx={{ '&:hover': { backgroundColor: '#f0f0f0' }, height: '40px' }} // Set fixed height for rows
              >
                <TableCell align="center" sx={{ padding: '8px' }}>{user.id}</TableCell>

                {/* Display Email */}
                <TableCell align="center" sx={{ padding: '8px' }}>
                  {editMode === user.id ? (
                    <TextField
                      value={editUser.email}
                      name="email"
                      onChange={handleEditInputChange}
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    user.email
                  )}
                </TableCell>

                {/* Editable Role Field */}
                <TableCell align="center" sx={{ padding: '8px' }}>
                  {editMode === user.id ? (
                    <TextField
                      select
                      value={editUser.role}
                      name="role"
                      onChange={handleEditInputChange}
                      variant="outlined"
                      size="small"
                    >
                      <MenuItem value="user">
                        <PersonIcon sx={{ mr: 1 }} />
                        User
                      </MenuItem>
                      <MenuItem value="admin">
                        <AdminIcon sx={{ mr: 1 }} />
                        Admin
                      </MenuItem>
                    </TextField>
                  ) : (
                    <>
                      {user.role === 'User' ? <PersonIcon sx={{ mr: 1 }} /> : <AdminIcon sx={{ mr: 1 }} />}
                      {user.role}
                    </>
                  )}
                </TableCell>

                {/* Active Status Toggle */}
                <TableCell align="center">
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={editMode === user.id ? editUser.active : user.active}
                        onChange={() => setEditUser({ ...editUser, active: !editUser.active })}
                        color="primary"
                      />
                    }
                    label={user.active ? 'Active' : 'Inactive'}
                  />
                </TableCell>

                {/* Actions: Edit, Save, Cancel */}
                <TableCell align="center" sx={{ padding: '8px' }}>
                  {editMode === user.id ? (
                    <>
                      <IconButton onClick={() => handleSaveEditUser(user.id)} color="success">
                        <SaveIcon />
                      </IconButton>
                      <IconButton onClick={handleCancelEdit} color="error">
                        <CancelIcon />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton onClick={() => handleEditUser(user)} color="primary">
                      <EditIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserManagement;
