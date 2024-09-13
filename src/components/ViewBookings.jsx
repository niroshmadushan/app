import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, Grid, TextField, MenuItem, InputAdornment, Button
} from '@mui/material';
import { Search as SearchIcon, FilterList as FilterListIcon, Print as PrintIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext'; // For role-based views
import axios from 'axios'; // Import Axios for HTTP requests
import jsPDF from 'jspdf'; // Import jsPDF for generating PDFs

const ViewBookings = () => {
  const { user } = useAuth();
  const [BookingInfo, setBookingInfo] = useState([]);
  const [PaymentInfo, setPaymentInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // Default to no filter

  useEffect(() => {
    // Fetch data from the PHP backend
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost/back/get_all_booking_payment_details.php');
      setBookingInfo(response.data.bookingData);
      setPaymentInfo(response.data.paymentData);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getBookingPaymentStatus = (bookingId) => {
    const payment = PaymentInfo.find(p => p.bookingId === bookingId);
    return payment ? payment.paymentStatus : 'Unknown';
  };

  const getBookingPaymenid = (bookingId) => {
    const payment = PaymentInfo.find(p => p.bookingId === bookingId);
    return payment ? payment.paymentId : 'Unknown';
  };

  const getBookingPaymentmethod = (bookingId) => {
    const payment = PaymentInfo.find(p => p.bookingId === bookingId);
    return payment ? payment.paymentMethod : 'Unknown';
  };

  const getBookingPaymentamount = (bookingId) => {
    const payment = PaymentInfo.find(p => p.bookingId === bookingId);
    return payment ? payment.amountPaid : 'Unknown';
  };

  const getBookingPaymentdue = (bookingId) => {
    const payment = PaymentInfo.find(p => p.bookingId === bookingId);
    return payment ? payment.balanceDue : 'Unknown';
  };

  const getBookingPaymentdate = (bookingId) => {
    const payment = PaymentInfo.find(p => p.bookingId === bookingId);
    return payment ? payment.paymentDate : 'Unknown';
  };

  const handleOpen = (booking) => {
    setSelectedBooking(booking);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // Filtering logic
  const filteredBookings = BookingInfo.filter((booking) => {
    const matchesSearchTerm =
      booking.bookingId.toString().includes(searchTerm) ||
      booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.contactInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.nicPassport.includes(searchTerm);

    const matchesStatusFilter = statusFilter ? booking.payment?.paymentStatus === statusFilter : true;
    return matchesSearchTerm && matchesStatusFilter;
  });

  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Title
    doc.setFontSize(18);
    doc.text('Booking Details Report', 105, 20, { align: 'center' });
  
    // Report Date and Time
    const reportDate = new Date().toLocaleString();
    doc.setFontSize(12);
    doc.text(`Generated on: ${reportDate}`, 105, 30, { align: 'center' });
  
    // Booking Details in Two-Column Layout
    doc.setFontSize(14);
    doc.text('Booking Information', 10, 40);
    doc.setFontSize(12);
    const colStartLeft = 10;
    const colStartRight = 80;
    let yOffset = 50;
  
    // Add each field in the PDF
    doc.text(`Booking ID:`, colStartLeft, yOffset);
    doc.text(`${selectedBooking.bookingId}`, colStartRight, yOffset);
  
    yOffset += 10;
    doc.text(`Guest Name:`, colStartLeft, yOffset);
    doc.text(`${selectedBooking.guestName}`, colStartRight, yOffset);
  
    yOffset += 10;
    doc.text(`NIC/Passport ID:`, colStartLeft, yOffset);
    doc.text(`${selectedBooking.idPassport}`, colStartRight, yOffset);
  
    yOffset += 10;
    doc.text(`Email:`, colStartLeft, yOffset);
    doc.text(`${selectedBooking.guestEmail}`, colStartRight, yOffset);
  
    yOffset += 10;
    doc.text(`Phone Number:`, colStartLeft, yOffset);
    doc.text(`${selectedBooking.guestPhone}`, colStartRight, yOffset);
  
    yOffset += 10;
    doc.text(`Address:`, colStartLeft, yOffset);
    doc.text(`${selectedBooking.address}`, colStartRight, yOffset);
  
    yOffset += 10;
    doc.text(`Check-In Date:`, colStartLeft, yOffset);
    doc.text(`${selectedBooking.checkInDate}`, colStartRight, yOffset);
  
    yOffset += 10;
    doc.text(`Check-Out Date:`, colStartLeft, yOffset);
    doc.text(`${selectedBooking.checkOutDate}`, colStartRight, yOffset);
  
    yOffset += 10;
    doc.text(`Room Type:`, colStartLeft, yOffset);
    doc.text(`${selectedBooking.roomType}`, colStartRight, yOffset);
  
    yOffset += 10;
    doc.text(`Number of Rooms:`, colStartLeft, yOffset);
    doc.text(`${selectedBooking.numRooms}`, colStartRight, yOffset);
  
    yOffset += 10;
    doc.text(`Number of Guests:`, colStartLeft, yOffset);
    doc.text(`${selectedBooking.numGuests}`, colStartRight, yOffset);
  
    yOffset += 10;
    doc.text(`Special Requests:`, colStartLeft, yOffset);
    doc.text(`${selectedBooking.specialRequests}`, colStartRight, yOffset);
  
    yOffset += 10;
    doc.text(`Arrival Time:`, colStartLeft, yOffset);
    doc.text(`${selectedBooking.arrivalTime}`, colStartRight, yOffset);
  
    yOffset += 10;
    doc.text(`Departure Time:`, colStartLeft, yOffset);
    doc.text(`${selectedBooking.departureTime}`, colStartRight, yOffset);
  
    yOffset += 10;
    doc.text(`Arrival Meal:`, colStartLeft, yOffset);
    doc.text(`${selectedBooking.arrivalMeal}`, colStartRight, yOffset);
  
    yOffset += 10;
    doc.text(`Departure Meal:`, colStartLeft, yOffset);
    doc.text(`${selectedBooking.departureMeal}`, colStartRight, yOffset);
  
    // Payment Details
    yOffset += 20;
    doc.setFontSize(14);
    doc.text('Payment Information', 10, yOffset);
  
    yOffset += 10;
    doc.setFontSize(12);
    doc.text(`Amount Paid:`, colStartLeft, yOffset);
    doc.text(`${getBookingPaymentamount(selectedBooking.bookingId)}`, colStartRight, yOffset);
  
    yOffset += 10;
    doc.text(`Payment Status:`, colStartLeft, yOffset);
    doc.text(`${getBookingPaymentStatus(selectedBooking.bookingId)}`, colStartRight, yOffset);
  
    // Payment Date
    if (getBookingPaymentdate(selectedBooking.bookingId)) {
      yOffset += 10;
      doc.text(`Payment Date:`, colStartLeft, yOffset);
      doc.text(`${getBookingPaymentdate(selectedBooking.bookingId)}`, colStartRight, yOffset);
    }
  
    // Balance Due
    if (getBookingPaymentdue(selectedBooking.bookingId)) {
      yOffset += 10;
      doc.text(`Balance Due:`, colStartLeft, yOffset);
      doc.text(`${getBookingPaymentdue(selectedBooking.bookingId)}`, colStartRight, yOffset);
    }
  
    // Footer
    doc.setFontSize(10);
    doc.text('This is a system-generated report.', 105, 280, { align: 'center' });
  
    // Save the PDF with the booking ID in the filename
    doc.save(`Booking_${selectedBooking.id}.pdf`);
  };

  if (loading) {
    return <Typography>Loading bookings...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {user?.role === 'admin' ? 'All Bookings (Admin)' : 'Your Bookings'}
      </Typography>

      {/* Search and Filter Section */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 3 }}>
        <TextField
          variant="outlined"
          placeholder="Search by Booking ID, Guest Name, Email, NIC/Passport"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 350 }}
        />
        <TextField
          select
          label="Filter by Payment Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FilterListIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 250 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Paid">Paid</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Unpaid">Unpaid</MenuItem>
        </TextField>
      </Box>

      {/* Bookings Table */}
      <TableContainer component={Paper} sx={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1976d2' }}>
              <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold' }}>Booking ID</TableCell>
              <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold' }}>Guest Name</TableCell>
              <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold' }}>NIC/Passport ID</TableCell>
              <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold' }}>Check-In</TableCell>
              <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold' }}>Check-Out</TableCell>
              <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold' }}>Room Type</TableCell>
              <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold' }}>Guests</TableCell>
              <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <TableRow
                  key={booking.id}
                  onClick={() => handleOpen(booking)}
                  sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f0f0f0' } }}
                >
                  <TableCell align="center">{booking.bookingId}</TableCell>
                  <TableCell align="center">{booking.guestName}</TableCell>
                  <TableCell align="center">{booking.idPassport}</TableCell>
                  <TableCell align="center">{booking.checkInDate}</TableCell>
                  <TableCell align="center">{booking.checkOutDate}</TableCell>
                  <TableCell align="center">{booking.roomType}</TableCell>
                  <TableCell align="center">{booking.numGuests}</TableCell>
                  <TableCell align="center">{getBookingPaymentStatus(booking.bookingId)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No bookings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Booking Details Modal */}
      <Modal open={open} onClose={handleClose}>
        <Paper
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            p: 3,
            width: { xs: '90%', md: '60%' }, // Adjust width based on screen size
            maxHeight: '90vh', // Make modal responsive to screen height
            overflowY: 'auto', // Allow vertical scrolling
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          {selectedBooking && (
            <>
              <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', borderBottom: '1px solid #ddd', pb: 1 }}>
                Booking Details
              </Typography>
              <Grid container spacing={2}>
                {/* Left Column */}
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Guest Name:</Typography>
                  <Typography variant="body2">{selectedBooking.guestName}</Typography>

                  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2 }}>NIC/Passport ID:</Typography>
                  <Typography variant="body2">{selectedBooking.idPassport}</Typography>

                  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2 }}>Email:</Typography>
                  <Typography variant="body2">{selectedBooking.guestEmail}</Typography>

                  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2 }}>Phone Number:</Typography>
                  <Typography variant="body2">{selectedBooking.guestPhone}</Typography>

                  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2 }}>Address:</Typography>
                  <Typography variant="body2">{selectedBooking.address}</Typography>

                  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2 }}>Check-In Date:</Typography>
                  <Typography variant="body2">{selectedBooking.checkInDate}</Typography>

                  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2 }}>Check-Out Date:</Typography>
                  <Typography variant="body2">{selectedBooking.checkOutDate}</Typography>
                </Grid>

                {/* Right Column */}
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Room Type:</Typography>
                  <Typography variant="body2">{selectedBooking.roomType}</Typography>

                  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2 }}>Number of Rooms:</Typography>
                  <Typography variant="body2">{selectedBooking.numRooms}</Typography>

                  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2 }}>Number of Guests:</Typography>
                  <Typography variant="body2">{selectedBooking.numGuests}</Typography>

                  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2 }}>Special Requests:</Typography>
                  <Typography variant="body2">{selectedBooking.specialRequests}</Typography>

                  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2 }}>Arrival Time:</Typography>
                  <Typography variant="body2">{selectedBooking.arrivalTime}</Typography>

                  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2 }}>Departure Time:</Typography>
                  <Typography variant="body2">{selectedBooking.departureTime}</Typography>

                  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2 }}>Arrival Meal:</Typography>
                  <Typography variant="body2">{selectedBooking.arrivalMeal}</Typography>

                  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2 }}>Departure Meal:</Typography>
                  <Typography variant="body2">{selectedBooking.departureMeal}</Typography>
                </Grid>
              </Grid>

              {/* Payment Details */}
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Amount Paid:</Typography>
                  <Typography variant="body2">{getBookingPaymentamount(selectedBooking.bookingId)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Payment Status:</Typography>
                  <Typography variant="body2">{getBookingPaymentStatus(selectedBooking.bookingId)}</Typography>
                </Grid>

                {/* Conditional Payment Date */}
                {getBookingPaymentdate(selectedBooking.bookingId) && (
                  <>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Payment Date:</Typography>
                      <Typography variant="body2">{getBookingPaymentdate(selectedBooking.bookingId)}</Typography>
                    </Grid>
                  </>
                )}

                {/* Conditional Balance Due */}
                {getBookingPaymentdue(selectedBooking.bookingId) && (
                  <>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Balance Due:</Typography>
                      <Typography variant="body2">{getBookingPaymentdue(selectedBooking.bookingId)}</Typography>
                    </Grid>
                  </>
                )}
              </Grid>

              {/* Button to generate PDF */}
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                fullWidth
                startIcon={<PrintIcon />}
                onClick={generatePDF}
              >
                Print PDF
              </Button>
            </>
          )}
        </Paper>
      </Modal>
    </Box>
  );
};

export default ViewBookings;
