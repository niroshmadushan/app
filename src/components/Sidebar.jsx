import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Divider, Typography, Box, Tooltip } from '@mui/material';
import { Dashboard, Group, Book, Payment, Settings, Menu, Logout, Info as InfoIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth to get user role
import { Store as InventoryIcon } from '@mui/icons-material'; // Or use any other suitable icon

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Get user info from AuthContext
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false); // Close sidebar after navigation
  };

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page or any other page after logout
  };

  return (
    <>
      {/* Menu Button */}
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={toggleDrawer}
        edge="start"
        sx={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1000,
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            transform: 'scale(1.1)', // Slight scale up on hover
          },
          transition: 'transform 0.2s ease-in-out', // Smooth transition effect
        }}
      >
        <Menu />
      </IconButton>

      {/* Sidebar Drawer */}
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={toggleDrawer}
        sx={{ width: 240, flexShrink: 0 }}
        variant="temporary" // Temporary variant for responsive drawer
        ModalProps={{
          keepMounted: true, // Better performance on mobile
        }}
        PaperProps={{
          sx: {
            width: 240,
            backgroundColor: '#f5f5f5', // Light background color
            boxShadow: '2px 0 5px rgba(0,0,0,0.1)', // Subtle shadow
          },
        }}
      >
        {/* Sidebar Title */}
        <Box sx={{ p: 2, textAlign: 'center', backgroundColor: '#1976d2', color: 'white' }}>
          <Typography variant="h6">{user?.role === 'admin' ? 'Admin Panel' : 'User Panel'}</Typography>
        </Box>
        <Divider />

        {/* Sidebar List */}
        <List>
          <Tooltip title="Dashboard" placement="right">
            <ListItem
              button
              onClick={() => handleNavigation(user?.role === 'admin' ? '/admin' : '/user/dashboard')}
              sx={{
                '&:hover': {
                  backgroundColor: '#e0e0e0', // Highlight color on hover
                  cursor: 'pointer',
                  transform: 'translateX(4px)', // Slight slide effect
                  transition: 'transform 0.2s ease-in-out',
                },
              }}
            >
              <ListItemIcon>
                <Dashboard />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
          </Tooltip>

          {user?.role === 'admin' && (
            <>
              <Tooltip title="Manage Users" placement="right">
                <ListItem
                  button
                  onClick={() => handleNavigation('/admin/users')}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#e0e0e0',
                      cursor: 'pointer',
                      transform: 'translateX(4px)',
                      transition: 'transform 0.2s ease-in-out',
                    },
                  }}
                >
                  <ListItemIcon>
                    <Group />
                  </ListItemIcon>
                  <ListItemText primary="Manage Users" />
                </ListItem>
              </Tooltip>
            </>
          )}

          {/* Shared options for both Admin and User roles */}
          <Tooltip title="Bookings" placement="right">
            <ListItem
              button
              onClick={() => handleNavigation(user?.role === 'admin' ? '/admin/bookings' : '/user/bookings')}
              sx={{
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                  cursor: 'pointer',
                  transform: 'translateX(4px)',
                  transition: 'transform 0.2s ease-in-out',
                },
              }}
            >
              <ListItemIcon>
                <Book />
              </ListItemIcon>
              <ListItemText primary="Bookings" />
            </ListItem>
          </Tooltip>

          <Tooltip title="Payments" placement="right">
            <ListItem
              button
              onClick={() => handleNavigation(user?.role === 'admin' ? '/admin/payments' : '/user/payments')}
              sx={{
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                  cursor: 'pointer',
                  transform: 'translateX(4px)',
                  transition: 'transform 0.2s ease-in-out',
                },
              }}
            >
              <ListItemIcon>
                <Payment />
              </ListItemIcon>
              <ListItemText primary="Payments" />
            </ListItem>
          </Tooltip>

          <Tooltip title="Account Settings" placement="right">
            <ListItem
              button
              onClick={() => handleNavigation(user?.role === 'admin' ? '/admin/settings' : '/user/settings')}
              sx={{
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                  cursor: 'pointer',
                  transform: 'translateX(4px)',
                  transition: 'transform 0.2s ease-in-out',
                },
              }}
            >
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="Account Settings" />
            </ListItem>
          </Tooltip>

          {/* "All Bookings Details" Button */}
          <Tooltip title="View All Booking Details" placement="right">
            <ListItem
              button
              onClick={() => handleNavigation(user?.role === 'admin' ? '/admin/book' : '/user/book')}
              sx={{
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                  cursor: 'pointer',
                  transform: 'translateX(4px)',
                  transition: 'transform 0.2s ease-in-out',
                },
              }}
            >
              <ListItemIcon>
                <InfoIcon />
              </ListItemIcon>
              <ListItemText primary="All Bookings Details" />
            </ListItem>
          </Tooltip>
          <Tooltip title="Inventory Management" placement="right">
            <ListItem
              button
              onClick={() => handleNavigation(user?.role === 'admin' ? '/admin/inventory' : '/user/inventory')}
              sx={{
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                  cursor: 'pointer',
                  transform: 'translateX(4px)',
                  transition: 'transform 0.2s ease-in-out',
                },
              }}
            >
              <ListItemIcon>
                <InventoryIcon /> {/* Replace this with an appropriate icon */}
              </ListItemIcon>
              <ListItemText primary="Inventory" />
            </ListItem>
          </Tooltip>
        </List>

        <Divider />

        {/* Log Out Button */}
        <List>
          <Tooltip title="Log Out" placement="right">
            <ListItem
              button
              onClick={handleLogout}
              sx={{
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                  cursor: 'pointer',
                  transform: 'translateX(4px)',
                  transition: 'transform 0.2s ease-in-out',
                },
              }}
            >
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Log Out" />
            </ListItem>
          </Tooltip>
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
