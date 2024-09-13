import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Dashboard as DashboardIcon, People as PeopleIcon, Book as BookIcon, Payment as PaymentIcon, Settings as SettingsIcon, Logout as LogoutIcon, Visibility as VisibilityIcon, Inventory as InventoryIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    logout();
    navigate('/'); // Redirect to login after logout
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: 1000, 
        backgroundColor: '#1a237e', 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' // Slight shadow for a lifted effect
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 5 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold',marginLeft:'30px' }}>
          {user?.role === 'admin' ? 'Admin Panel' : 'User Panel'}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {user?.role === 'admin' ? (
            <>
              <Button 
                color="inherit" 
                onClick={() => handleNavigation('/admin')}
                startIcon={<DashboardIcon />}
                sx={{ textTransform: 'none', '&:hover': { backgroundColor: '#3949ab' }, transition: '0.3s ease' }}
              >
                Dashboard
              </Button>
              <Button 
                color="inherit" 
                onClick={() => handleNavigation('/admin/users')}
                startIcon={<PeopleIcon />}
                sx={{ textTransform: 'none', '&:hover': { backgroundColor: '#3949ab' }, transition: '0.3s ease' }}
              >
                Manage Users
              </Button>
              <Button 
                color="inherit" 
                onClick={() => handleNavigation('/admin/bookings')}
                startIcon={<BookIcon />}
                sx={{ textTransform: 'none', '&:hover': { backgroundColor: '#3949ab' }, transition: '0.3s ease' }}
              >
                Bookings
              </Button>
              <Button 
                color="inherit" 
                onClick={() => handleNavigation('/admin/payments')}
                startIcon={<PaymentIcon />}
                sx={{ textTransform: 'none', '&:hover': { backgroundColor: '#3949ab' }, transition: '0.3s ease' }}
              >
                Payments
              </Button>
              <Button 
                color="inherit" 
                onClick={() => handleNavigation('/admin/settings')}
                startIcon={<SettingsIcon />}
                sx={{ textTransform: 'none', '&:hover': { backgroundColor: '#3949ab' }, transition: '0.3s ease' }}
              >
                Account Settings
              </Button>
              {/* Inventory Management Button for Admin */}
              <Button 
                color="inherit" 
                onClick={() => handleNavigation('/admin/inventory')}
                startIcon={<InventoryIcon />}
                sx={{ textTransform: 'none', '&:hover': { backgroundColor: '#3949ab' }, transition: '0.3s ease' }}
              >
                Inventory
              </Button>
              {/* View Bookings Button for Admin */}
              <Button
                color="inherit"
                onClick={() => handleNavigation('/admin/book')}
                startIcon={<VisibilityIcon />} 
                sx={{ textTransform: 'none', '&:hover': { backgroundColor: '#3949ab' }, transition: '0.3s ease' }}
              >
                View Bookings
              </Button>
            </>
          ) : (
            <>
              <Button 
                color="inherit" 
                onClick={() => handleNavigation('/user')}
                startIcon={<DashboardIcon />}
                sx={{ textTransform: 'none', '&:hover': { backgroundColor: '#3949ab' }, transition: '0.3s ease' }}
              >
                Dashboard
              </Button>
              <Button 
                color="inherit" 
                onClick={() => handleNavigation('/user/bookings')}
                startIcon={<BookIcon />}
                sx={{ textTransform: 'none', '&:hover': { backgroundColor: '#3949ab' }, transition: '0.3s ease' }}
              >
                Bookings
              </Button>
              <Button 
                color="inherit" 
                onClick={() => handleNavigation('/user/inventory')}
                startIcon={<InventoryIcon />}
                sx={{ textTransform: 'none', '&:hover': { backgroundColor: '#3949ab' }, transition: '0.3s ease' }}
              >
                Inventory
              </Button>
              <Button 
                color="inherit" 
                onClick={() => handleNavigation('/user/payments')}
                startIcon={<PaymentIcon />}
                sx={{ textTransform: 'none', '&:hover': { backgroundColor: '#3949ab' }, transition: '0.3s ease' }}
              >
                Payments
              </Button>
              <Button 
                color="inherit" 
                onClick={() => handleNavigation('/user/settings')}
                startIcon={<SettingsIcon />}
                sx={{ textTransform: 'none', '&:hover': { backgroundColor: '#3949ab' }, transition: '0.3s ease' }}
              >
                Account Settings
              </Button>
              {/* View Bookings Button for User */}
              <Button
                color="inherit"
                onClick={() => handleNavigation('/user/book')}
                startIcon={<VisibilityIcon />}  
                sx={{ textTransform: 'none', '&:hover': { backgroundColor: '#3949ab' }, transition: '0.3s ease' }}
              >
                View Bookings
              </Button>
            </>
          )}

          {/* Logout Button */}
          <IconButton 
            color="inherit" 
            onClick={handleLogout} 
            sx={{ '&:hover': { backgroundColor: '#f44336' }, transition: '0.3s ease' }} // Red on hover for emphasis
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
