import React from 'react';
import { Box, TextField, Button, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const SearchBar = ({ searchQuery, setSearchQuery, onSearch }) => {
  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch(''); // Trigger search with empty query to reset results
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleInputChange}
        sx={{ mr: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <IconButton onClick={handleClearSearch}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button variant="contained" color="primary" onClick={() => onSearch(searchQuery)}>
        Search
      </Button>
    </Box>
  );
};

export default SearchBar;
