import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a Context for Bookings
const BookingContext = createContext();

// Custom hook to use BookingContext
export const useBookings = () => useContext(BookingContext);

// BookingProvider component to provide booking state and functions
export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);

  // Function to fetch bookings (simulate an API call)
  const fetchBookings = async () => {
    // Replace this with an actual API call
    const mockBookings = [
      {
        id: 1,
        guestName: 'John Doe',
        email: 'john@example.com',
        checkIn: '2023-09-01',
        checkOut: '2023-09-05',
        location: 'Villa 1',
        status: 'Booked',
      },
      {
        id: 2,
        guestName: 'Jane Smith',
        email: 'jane@example.com',
        checkIn: '2023-09-10',
        checkOut: '2023-09-15',
        location: 'Villa 2',
        status: 'Pending',
      },
    ];
    setBookings(mockBookings);
  };

  // Function to add a new booking
  const addBooking = (booking) => {
    setBookings((prevBookings) => [...prevBookings, booking]);
  };

  // Function to update an existing booking
  const updateBooking = (updatedBooking) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === updatedBooking.id ? updatedBooking : booking
      )
    );
  };

  // Function to delete a booking
  const deleteBooking = (bookingId) => {
    setBookings((prevBookings) =>
      prevBookings.filter((booking) => booking.id !== bookingId)
    );
  };

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <BookingContext.Provider
      value={{ bookings, addBooking, updateBooking, deleteBooking }}
    >
      {children}
    </BookingContext.Provider>
  );
};
