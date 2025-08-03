import React from 'react';
import { Box } from '@mui/material';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import SearchBar from '../components/SearchBar';
import FeaturedEvents from '../components/FeaturedEvents';
import Categories from '../components/Categories';
import HowItWorks from '../components/HowItWorks';
import TrustSection from '../components/TrustSection';
import Footer from '../components/Footer';

const Homepage = () => {
  return (
    <Box sx={{ minHeight: '100vh', overflow: 'hidden' }}>
      <Header />
      <HeroSection />
      <SearchBar />
      <FeaturedEvents />
      <Categories />
      <HowItWorks />
      <TrustSection />
      <Footer />
    </Box>
  );
};

export default Homepage; 