import React, { useState } from 'react';
import { Box, TextField, Button, MenuItem, Typography, Paper, InputAdornment } from '@mui/material';
import {
  AccountCircle as AccountCircleIcon, Home as HomeIcon, Badge as BadgeIcon, DateRange as DateRangeIcon,
  Hotel as HotelIcon, Group as GroupIcon, Comment as CommentIcon, AccessTime as AccessTimeIcon,
  Restaurant as RestaurantIcon, Email as EmailIcon, Phone as PhoneIcon
} from '@mui/icons-material';
import Swal from 'sweetalert2';  // Import SweetAlert2
import axios from 'axios';

const BookingForm = () => {
  const [formValues, setFormValues] = useState({
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    address: '',
    idPassport: '',
    checkInDate: '',
    checkOutDate: '',
    roomType: '',
    numRooms: 1,
    numGuests: 1,
    specialRequests: '',
    arrivalTime: '',
    arrivalMeal: '',
    departureTime: '',
    departureMeal: '',
  });

  const [errors, setErrors] = useState({});

  // Validation for all form fields
  const validate = () => {
    let tempErrors = {};

    if (!formValues.guestName.trim()) tempErrors.guestName = "Guest name is required";
    if (!formValues.guestPhone.match(/^\d+$/)) tempErrors.guestPhone = "Phone number can only contain digits";
    if (!formValues.guestEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) tempErrors.guestEmail = "Enter a valid email";
    if (!formValues.address.trim()) tempErrors.address = "Address is required";
    if (!formValues.idPassport.trim()) tempErrors.idPassport = "ID/Passport No is required";
    if (!formValues.checkInDate) tempErrors.checkInDate = "Check-in date is required";
    if (!formValues.checkOutDate) tempErrors.checkOutDate = "Check-out date is required";
    if (!formValues.arrivalTime) tempErrors.arrivalTime = "Arrival time is required";
    if (!formValues.departureTime) tempErrors.departureTime = "Departure time is required";
    if (!formValues.arrivalMeal) tempErrors.arrivalMeal = "Arriving meal selection is required";
    if (!formValues.departureMeal) tempErrors.departureMeal = "Departure meal selection is required";

    if (formValues.numRooms <= 0) tempErrors.numRooms = "Number of rooms must be at least 1";
    if (formValues.numGuests < 1 || formValues.numGuests > 100000) tempErrors.numGuests = "Number of guests must be between 1 and 100,000";

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.post('http://localhost/back/add_booking.php', formValues);

        Swal.fire({
          title: 'Success!',
          text: 'Booking added successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });

        // Reset form fields
        setFormValues({
          guestName: '',
          guestPhone: '',
          guestEmail: '',
          address: '',
          idPassport: '',
          checkInDate: '',
          checkOutDate: '',
          roomType: '',
          numRooms: 1,
          numGuests: 1,
          specialRequests: '',
          arrivalTime: '',
          arrivalMeal: '',
          departureTime: '',
          departureMeal: '',
        });
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'There was an error saving the booking. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } else {
      Swal.fire({
        title: 'Warning!',
        text: 'Please fill in all required fields correctly.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Paper sx={{ p: 4, maxWidth: '600px', width: '100%', borderRadius: '8px', backgroundColor: '#ffffff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <Typography variant="h5" gutterBottom>
          Booking Form
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Guest Name"
            name="guestName"
            value={formValues.guestName}
            onChange={handleChange}
            sx={{ mb: 2 }}
            error={!!errors.guestName}
            helperText={errors.guestName}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Guest Phone"
            name="guestPhone"
            value={formValues.guestPhone}
            onChange={handleChange}
            sx={{ mb: 2 }}
            error={!!errors.guestPhone}
            helperText={errors.guestPhone}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Guest Email"
            name="guestEmail"
            value={formValues.guestEmail}
            onChange={handleChange}
            sx={{ mb: 2 }}
            error={!!errors.guestEmail}
            helperText={errors.guestEmail}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={formValues.address}
            onChange={handleChange}
            sx={{ mb: 2 }}
            error={!!errors.address}
            helperText={errors.address}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HomeIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="ID/Passport No"
            name="idPassport"
            value={formValues.idPassport}
            onChange={handleChange}
            sx={{ mb: 2 }}
            error={!!errors.idPassport}
            helperText={errors.idPassport}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            type="date"
            label="Check-In Date"
            name="checkInDate"
            value={formValues.checkInDate}
            onChange={handleChange}
            sx={{ mb: 2 }}
            error={!!errors.checkInDate}
            helperText={errors.checkInDate}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DateRangeIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            type="date"
            label="Check-Out Date"
            name="checkOutDate"
            value={formValues.checkOutDate}
            onChange={handleChange}
            sx={{ mb: 2 }}
            error={!!errors.checkOutDate}
            helperText={errors.checkOutDate}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DateRangeIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Room Type"
            name="roomType"
            value={formValues.roomType}
            onChange={handleChange}
            select
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HotelIcon />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="Single">Single</MenuItem>
            <MenuItem value="Double">Double</MenuItem>
            <MenuItem value="Suite">Suite</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Number of Rooms"
            name="numRooms"
            value={formValues.numRooms}
            onChange={handleChange}
            type="number"
            sx={{ mb: 2 }}
            error={!!errors.numRooms}
            helperText={errors.numRooms}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HotelIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Number of Guests"
            name="numGuests"
            value={formValues.numGuests}
            onChange={handleChange}
            type="number"
            inputProps={{ min: 1, max: 100000 }}
            sx={{ mb: 2 }}
            error={!!errors.numGuests}
            helperText={errors.numGuests}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <GroupIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Special Requests"
            name="specialRequests"
            value={formValues.specialRequests}
            onChange={handleChange}
            multiline
            rows={4}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CommentIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            type="time"
            label="Arrival Time"
            name="arrivalTime"
            value={formValues.arrivalTime}
            onChange={handleChange}
            sx={{ mb: 2 }}
            error={!!errors.arrivalTime}
            helperText={errors.arrivalTime}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccessTimeIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            type="time"
            label="Departure Time"
            name="departureTime"
            value={formValues.departureTime}
            onChange={handleChange}
            sx={{ mb: 2 }}
            error={!!errors.departureTime}
            helperText={errors.departureTime}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccessTimeIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Arriving Meal"
            name="arrivalMeal"
            value={formValues.arrivalMeal}
            onChange={handleChange}
            select
            sx={{ mb: 2 }}
            error={!!errors.arrivalMeal}
            helperText={errors.arrivalMeal}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <RestaurantIcon />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="BREAKFAST">Breakfast</MenuItem>
            <MenuItem value="LUNCH">Lunch</MenuItem>
            <MenuItem value="DINNER">Dinner</MenuItem>
            <MenuItem value="None">None</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Departure Meal"
            name="departureMeal"
            value={formValues.departureMeal}
            onChange={handleChange}
            select
            sx={{ mb: 2 }}
            error={!!errors.departureMeal}
            helperText={errors.departureMeal}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <RestaurantIcon />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="BREAKFAST">Breakfast</MenuItem>
            <MenuItem value="LUNCH">Lunch</MenuItem>
            <MenuItem value="DINNER">Dinner</MenuItem>
            <MenuItem value="None">None</MenuItem>
          </TextField>

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Book Now
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default BookingForm;
