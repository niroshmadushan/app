import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import Swal from 'sweetalert2';
import axios from 'axios';

const AddProductModal = ({ open, onClose, setProductList, productList }) => {
  const [productName, setProductName] = useState('');

  const handleAddProduct = async () => {
    
    if (!productName.trim()) {
      Swal.fire('Error', 'Product name cannot be empty.', 'error');
      return;
    }

    try {
      // Make a POST request to add the product
      const response = await axios.post('http://localhost/back/add_product.php', {
        name: productName
      });

      // Check if the product was added successfully
      if (response.data.success) {
        Swal.fire('Success', 'Product added successfully!', 'success');
        
        // Update the product list with the newly added product
        setProductList([...productList, { id: response.data.id, name: response.data.name }]);
        
        // Clear input
        setProductName('');
        
        // Close the modal
        onClose();
      } else {
        Swal.fire('Error', response.data.message, 'error');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      Swal.fire('Error', 'Error adding product. Please try again.', 'error');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Product</DialogTitle>
      <DialogContent>
        <TextField
          label="Product Name"
          fullWidth
          margin="dense"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAddProduct} variant="contained" color="primary">Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductModal;
