const bookings = [
    {
      id: '1',
      guestName: 'John Doe',
      contactInfo: 'john.doe@example.com, +123456789',
      address: '123 Main St, City, Country',
      nicPassport: '200073250',
      checkIn: '2023-09-01',
      checkOut: '2023-09-05',
      roomType: 'Suite',
      guests: 2,
      amountPaid: '$500',
      paymentDate: '2024/01/02',
      balanceDue: 'Rs.500.00',
      status: 'Paid',
    },
    {
      id: '2',
      guestName: 'Jane Smith',
      contactInfo: 'jane.smith@example.com, +987654321',
      address: '456 Elm St, City, Country',
      nicPassport: '200073250',
      checkIn: '2023-09-10',
      checkOut: '2023-09-15',
      roomType: 'Double',
      guests: 3,
      amountPaid: '$300',
      status: 'Pending',
    },
    // Add more mock bookings as needed
  ];
  
  export default bookings;
  