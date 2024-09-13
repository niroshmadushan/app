import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, MenuItem } from '@mui/material';
import axios from 'axios'; // To send requests to the backend
import Swal from 'sweetalert2'; // Import SweetAlert2

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

export const GRNModal = ({ open, onClose, setInventory, setGrnEntries, inventory }) => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [productList, setProductList] = useState([]); // To store product list

  // Fetch the product list from the backend when the modal opens
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
  }); // Fetch the product list only when the modal opens

  const handleSubmit = async () => {
    if (!selectedProduct || !quantity || !unitPrice) {
      Swal.fire('Warning', 'Please fill in all fields.', 'warning');
      return;
    }

    try {
      // Make a POST request to the backend to add a GRN entry
      const response = await axios.post('http://localhost/back/add_grn.php', {
        product: selectedProduct,
        quantity: parseFloat(quantity),
        unitPrice: parseFloat(unitPrice),
      });

      if (response.data.success) {
        // Update inventory and GRN entries
        const newGrnEntry = {
          id: response.data.id,
          product: selectedProduct,
          quantity: parseFloat(quantity),
          unitPrice: parseFloat(unitPrice),
          total: parseFloat(quantity) * parseFloat(unitPrice),
        };
        setGrnEntries((prevEntries) => [...prevEntries, newGrnEntry]);

        // Update or add product to the inventory
        const existingProduct = inventory.find((product) => product.name === selectedProduct);
        if (existingProduct) {
          const updatedInventory = inventory.map((product) =>
            product.name === selectedProduct
              ? { ...product, quantity: product.quantity + parseFloat(quantity), unitPrice: parseFloat(unitPrice) }
              : product
          );
          setInventory(updatedInventory);
        } else {
          const newProduct = {
            id: inventory.length + 1,
            name: selectedProduct,
            quantity: parseFloat(quantity),
            unitPrice: parseFloat(unitPrice),
          };
          setInventory([...inventory, newProduct]);
        }

        // Show success alert
        Swal.fire('Success', 'GRN entry added successfully!', 'success');
        onClose();
        setQuantity('');
        setUnitPrice('');
      } else {
        Swal.fire('Error', response.data.message, 'error');
      }
    } catch (error) {
      console.error('Error adding GRN entry:', error);
      Swal.fire('Error', 'Error adding GRN entry. Please try again.', 'error');
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
        <TextField
          label="Unit Price"
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
          Add GRN
        </Button>
      </Box>
    </Modal>
  );
};

export default GRNModal;
