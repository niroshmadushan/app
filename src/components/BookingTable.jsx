import React, { useState } from 'react';
import { Box } from '@mui/material';
import DataTable from './DataTable';
import SearchBar from './SearchBar';
import { useBookings } from '../context/BookingContext'; // Import useBookings hook

const BookingTable = () => {
  const { bookings, deleteBooking } = useBookings(); // Access bookings and delete function from context
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Filtering logic can be applied here based on searchQuery
  };

  const columns = [
    { id: 'id', label: 'Booking ID' },
    { id: 'guestName', label: 'Guest Name' },
    { id: 'email', label: 'Email' },
    { id: 'checkIn', label: 'Check-In' },
    { id: 'checkOut', label: 'Check-Out' },
    { id: 'location', label: 'Location' },
    { id: 'status', label: 'Status' },
    { 
      id: 'actions', 
      label: 'Actions', 
      render: (row) => (
        <Button variant="contained" color="secondary" onClick={() => deleteBooking(row.id)}>
          Delete
        </Button>
      )
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />
      <DataTable columns={columns} data={bookings} />
    </Box>
  );
};

export default BookingTable;
