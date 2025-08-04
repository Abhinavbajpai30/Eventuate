import React from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import SearchBar from './SearchBar';
import Categories from './Categories';
import HowItWorks from './HowItWorks';
import TrustSection from './TrustSection';
import Footer from './Footer';

const Homepage = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      <Header />
      <HeroSection />
      <SearchBar />
      <Categories />
      <HowItWorks />
      <TrustSection />
      <Footer />
    </div>
  );
};

export default Homepage; 