import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, MenuItem } from '@mui/material';
import axios from 'axios'; // To send requests to the backend
import Swal from 'sweetalert2'; // For alerts

const modalStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  p: 4,
  boxShadow: 24,
};

export const GONModal = ({ open, onClose, setInventory, setGonEntries, inventory }) => {
  const [productList, setProductList] = useState([]); // State for the product list
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');

  // Fetch the product list when the modal opens
  useEffect(() => {
    if (open) {
      const fetchProducts = async () => {
        try {
          const response = await axios.get('http://localhost/back/get_products.php');
          if (response.data.success) {
            setProductList(response.data.products); // Set the product list from response
          } else {
            Swal.fire('Error', 'Failed to load products: ' + response.data.message, 'error');
          }
        } catch (error) {
          console.error('Error fetching products:', error);
          Swal.fire('Error', 'Error fetching products.', 'error');
        }
      };

      fetchProducts();
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!selectedProduct || !quantity) {
      Swal.fire('Warning', 'Please fill in all fields.', 'warning');
      return;
    }

    try {
      const response = await axios.post('http://localhost/back/add_gon.php', {
        product: selectedProduct,
        quantity: parseFloat(quantity),
      });

      if (response.data.success) {
        // Update GON entries and refresh inventory
        Swal.fire('Success', 'GON entry added and current stock updated!', 'success');
        onClose();
        setQuantity('');
        setSelectedProduct('');
      } else {
        Swal.fire('Error', response.data.message, 'error');
      }
    } catch (error) {
      console.error('Error adding GON entry:', error);
      Swal.fire('Error', 'Failed to add GON entry. Please try again.', 'error');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyles}>
        <TextField
          select
          label="Product"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        >
          {productList.map((product) => (
            <MenuItem key={product.id} value={product.name}>
              {product.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
          Add GON
        </Button>
      </Box>
    </Modal>
  );
};

export default GONModal;
