import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, InputAdornment, Modal
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, ListAlt as ReportIcon, LocalShipping as GRNIcon, ExitToApp as GONIcon } from '@mui/icons-material';
import AddProductModal from '../components/AddProductModal';
import GRNModal from '../components/GRNModal';
import GONModal from '../components/GONModal';
import axios from 'axios';
import Swal from 'sweetalert2';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]); // Main inventory list
  const [productList, setProductList] = useState([]); // Product List for GRN/GON
  const [grnEntries, setGrnEntries] = useState([]); // GRN Entries
  const [gonEntries, setGonEntries] = useState([]); // GON Entries
  const [currentStock, setCurrentStock] = useState([]); // Current Stock
  const [searchTerm, setSearchTerm] = useState(''); // Search state
  const [openAddProductModal, setOpenAddProductModal] = useState(false); // Add Product Modal
  const [openGRNModal, setOpenGRNModal] = useState(false); // GRN Modal
  const [openGONModal, setOpenGONModal] = useState(false); // GON Modal
  const [openReportModal, setOpenReportModal] = useState(false); // Report Modal

  // Fetch current stock data from the backend
  const fetchCurrentStock = async () => {
    try {
      const response = await axios.get('http://localhost/back/get_current_stock.php');
      if (response.data.success) {
        setInventory(response.data.stock); // Update the inventory with current stock
      } else {
        Swal.fire('Error', response.data.message, 'error');
      }
    } catch (error) {
      console.error('Error fetching current stock:', error);
      Swal.fire('Error', 'Failed to fetch current stock. Please try again.', 'error');
    }
  };

  // Fetch all data when the "Generate Report" button is clicked
  const handleGenerateReport = () => {
    axios.get('http://localhost/back/get_report_data.php')
      .then(response => {
        if (response.data.success) {
          // Store the data to state variables
          setGrnEntries(response.data.grnEntries);
          setGonEntries(response.data.gonEntries);
          setCurrentStock(response.data.currentStock);
          // Open the modal
          setOpenReportModal(true);
        } else {
          Swal.fire('Error', response.data.message, 'error');
        }
      })
      .catch(error => {
        console.error('Error fetching report data:', error);
        Swal.fire('Error', 'An error occurred while generating the report.', 'error');
      });
  };

  // Function to handle print
  const handlePrint = () => {
    const printContents = document.getElementById('report-content').innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // To reload after print to reset the content
  };

  // Filter inventory based on the search term
  const filteredInventory = inventory.filter(product =>
    product?.product?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchCurrentStock();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {/* Title */}
      <Typography variant="h4" gutterBottom>Inventory Management</Typography>

      {/* Search Bar and Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          variant="outlined"
          placeholder="Search by Product Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAddProductModal(true)}>
            Add Product
          </Button>
          <Button variant="contained" startIcon={<GRNIcon />} onClick={() => setOpenGRNModal(true)}>
            GRN
          </Button>
          <Button variant="contained" startIcon={<GONIcon />} onClick={() => setOpenGONModal(true)}>
            GON
          </Button>
          <Button variant="contained" startIcon={<ReportIcon />} onClick={handleGenerateReport}>
            Generate Report
          </Button>
        </Box>
      </Box>

      {/* Inventory Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#1976d2' }}>
            <TableRow>
              <TableCell align="center" sx={{ color: '#fff' }}>ID</TableCell>
              <TableCell align="center" sx={{ color: '#fff' }}>Product Name</TableCell>
              <TableCell align="center" sx={{ color: '#fff' }}>Quantity</TableCell>
              <TableCell align="center" sx={{ color: '#fff' }}>Total Value (Rs.)</TableCell>
              <TableCell align="center" sx={{ color: '#fff' }}>Last Updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInventory.map((product, index) => (
              <TableRow key={index}>
                <TableCell align="center">{product.id}</TableCell>
                <TableCell align="center">{product.product}</TableCell>
                <TableCell align="center">{product.quantity}</TableCell>
                <TableCell align="center">{product.value}</TableCell>
                <TableCell align="center">{product.lastUpdated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Display Total Stock Value */}
      <Typography variant="h6" sx={{ mt: 2, textAlign: 'right' }}>
        Total Stock Value: Rs.{inventory.reduce((acc, product) => acc + product.value, 0).toFixed(2)}
      </Typography>

      {/* Modals for Add Product, GRN, GON */}
      <AddProductModal
        open={openAddProductModal}
        onClose={() => setOpenAddProductModal(false)}
        setProductList={setProductList}
        productList={productList}
      />
      <GRNModal
        open={openGRNModal}
        onClose={() => {
          setOpenGRNModal(false);
          fetchCurrentStock(); // Refresh stock after adding GRN
        }}
        setInventory={setInventory}
        setGrnEntries={setGrnEntries}
        productList={productList}
        inventory={inventory}
      />
      <GONModal
        open={openGONModal}
        onClose={() => {
          setOpenGONModal(false);
          fetchCurrentStock(); // Refresh stock after adding GON
        }}
        setInventory={setInventory}
        setGonEntries={setGonEntries}
        productList={productList}
        inventory={inventory}
      />

      {/* Report Modal for Showing Data */}
      <Modal open={openReportModal} onClose={() => setOpenReportModal(false)}>
        <Paper id="report-content" sx={{ p: 3, m: 'auto', mt: 5, width: '80%', maxHeight: '80vh', overflowY: 'auto' }}>
          <Typography variant="h6" gutterBottom>Inventory Report</Typography>

          {/* GRN Table */}
          <Typography variant="h6" gutterBottom>Goods Received Notes (GRNs)</Typography>
          <TableContainer component={Paper} sx={{ maxHeight: 300, overflow: 'auto' }}>
            <Table stickyHeader>
              <TableHead sx={{ backgroundColor: '#1976d2' }}>
                <TableRow>
                  <TableCell align="center" sx={{ color: '#fff' }}>ID</TableCell>
                  <TableCell align="center" sx={{ color: '#fff' }}>Product</TableCell>
                  <TableCell align="center" sx={{ color: '#fff' }}>Quantity</TableCell>
                  <TableCell align="center" sx={{ color: '#fff' }}>Unit Price (Rs.)</TableCell>
                  <TableCell align="center" sx={{ color: '#fff' }}>Total (Rs.)</TableCell>
                  <TableCell align="center" sx={{ color: '#fff' }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {grnEntries.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{entry.id}</TableCell>
                    <TableCell align="center">{entry.product}</TableCell>
                    <TableCell align="center">{entry.quantity}</TableCell>
                    <TableCell align="center">{entry.unitPrice}</TableCell>
                    <TableCell align="center">{entry.total}</TableCell>
                    <TableCell align="center">{entry.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* GON Table */}
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Goods Out Notes (GONs)</Typography>
          <TableContainer component={Paper} sx={{ maxHeight: 300, overflow: 'auto' }}>
            <Table stickyHeader>
              <TableHead sx={{ backgroundColor: '#1976d2' }}>
                <TableRow>
                  <TableCell align="center" sx={{ color: '#fff' }}>ID</TableCell>
                  <TableCell align="center" sx={{ color: '#fff' }}>Product</TableCell>
                  <TableCell align="center" sx={{ color: '#fff' }}>Quantity</TableCell>
                  <TableCell align="center" sx={{ color: '#fff' }}>Unit Price (Rs.)</TableCell>
                  <TableCell align="center" sx={{ color: '#fff' }}>Total (Rs.)</TableCell>
                  <TableCell align="center" sx={{ color: '#fff' }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gonEntries.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{entry.id}</TableCell>
                    <TableCell align="center">{entry.product}</TableCell>
                    <TableCell align="center">{entry.quantity}</TableCell>
                    <TableCell align="center">{entry.unitPrice}</TableCell>
                    <TableCell align="center">{entry.total}</TableCell>
                    <TableCell align="center">{entry.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Current Stock Table */}
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Current Stock</Typography>
          <TableContainer component={Paper} sx={{ maxHeight: 300, overflow: 'auto' }}>
            <Table stickyHeader>
              <TableHead sx={{ backgroundColor: '#1976d2' }}>
                <TableRow>
                  <TableCell align="center" sx={{ color: '#fff' }}>ID</TableCell>
                  <TableCell align="center" sx={{ color: '#fff' }}>Product</TableCell>
                  <TableCell align="center" sx={{ color: '#fff' }}>Quantity</TableCell>
                  <TableCell align="center" sx={{ color: '#fff' }}>Total Value (Rs.)</TableCell>
                  <TableCell align="center" sx={{ color: '#fff' }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentStock.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{entry.id}</TableCell>
                    <TableCell align="center">{entry.product}</TableCell>
                    <TableCell align="center">{entry.quantity}</TableCell>
                    <TableCell align="center">{entry.value}</TableCell>
                    <TableCell align="center">{entry.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Print Button */}
          <Box sx={{ textAlign: 'right', mt: 3 }}>
            <Button variant="contained" color="primary" onClick={handlePrint}>
              Print Report
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
};

export default InventoryManagement;
