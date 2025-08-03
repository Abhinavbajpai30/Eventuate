import React, { useState } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import { Search as SearchIcon, LocationOn, CalendarToday, Category, AttachMoney } from '@mui/icons-material';
import { motion } from 'framer-motion';

const SearchBar = () => {
  const [searchData, setSearchData] = useState({
    query: '',
    location: '',
    date: '',
    category: '',
    priceRange: ''
  });

  const categories = [
    'All Categories',
    'Music',
    'Food & Drink',
    'Workshops',
    'Networking',
    'Sports',
    'Arts',
    'Technology',
    'Fitness'
  ];

  const priceRanges = [
    'Any Price',
    'Free',
    '$1 - $25',
    '$26 - $50',
    '$51 - $100',
    '$100+'
  ];

  const handleChange = (field) => (event) => {
    setSearchData({
      ...searchData,
      [field]: event.target.value
    });
  };

  const handleSearch = () => {
    console.log('Search data:', searchData);
    // Handle search functionality
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-16 relative z-10">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="bg-white/98 backdrop-blur-lg rounded-3xl p-8 border border-white/30 shadow-2xl">
          <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
            Find Your Perfect Event
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-2">
              <TextField
                fullWidth
                placeholder="Search events, organizers, or keywords..."
                value={searchData.query}
                onChange={handleChange('query')}
                InputProps={{
                  startAdornment: <SearchIcon className="mr-2 text-gray-400" />
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': {
                      borderColor: '#667eea'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#667eea'
                    }
                  }
                }}
              />
            </div>

            {/* Location */}
            <div>
              <TextField
                fullWidth
                placeholder="Location"
                value={searchData.location}
                onChange={handleChange('location')}
                InputProps={{
                  startAdornment: <LocationOn className="mr-2 text-gray-400" />
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': {
                      borderColor: '#667eea'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#667eea'
                    }
                  }
                }}
              />
            </div>

            {/* Date */}
            <div>
              <TextField
                fullWidth
                type="date"
                value={searchData.date}
                onChange={handleChange('date')}
                InputProps={{
                  startAdornment: <CalendarToday className="mr-2 text-gray-400" />
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': {
                      borderColor: '#667eea'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#667eea'
                    }
                  }
                }}
              />
            </div>

            {/* Category */}
            <div>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={searchData.category}
                  onChange={handleChange('category')}
                  label="Category"
                  startAdornment={<Category className="mr-2 text-gray-400" />}
                  sx={{
                    borderRadius: '12px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      '&:hover': {
                        borderColor: '#667eea'
                      }
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#667eea'
                    }
                  }}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Price Range */}
            <div>
              <FormControl fullWidth>
                <InputLabel>Price</InputLabel>
                <Select
                  value={searchData.priceRange}
                  onChange={handleChange('priceRange')}
                  label="Price"
                  startAdornment={<AttachMoney className="mr-2 text-gray-400" />}
                  sx={{
                    borderRadius: '12px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      '&:hover': {
                        borderColor: '#667eea'
                      }
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#667eea'
                    }
                  }}
                >
                  {priceRanges.map((range) => (
                    <MenuItem key={range} value={range}>
                      {range}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          {/* Search Button */}
          <div className="text-center mt-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={handleSearch}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:from-blue-600 hover:to-purple-700 flex items-center justify-center mx-auto"
              >
                <SearchIcon className="mr-2" />
                Search Events
              </button>
            </motion.div>
          </div>

          {/* Quick Filters */}
          <div className="mt-8 flex gap-2 flex-wrap justify-center items-center">
            <span className="text-sm text-gray-600 mr-2">Popular:</span>
            {['Free Events', 'This Weekend', 'Music', 'Networking'].map((filter) => (
              <motion.div
                key={filter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Chip
                  label={filter}
                  variant="outlined"
                  sx={{
                    borderRadius: '20px',
                    borderColor: '#667eea',
                    color: '#667eea',
                    '&:hover': {
                      backgroundColor: 'rgba(102, 126, 234, 0.1)'
                    }
                  }}
                  clickable
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SearchBar; 