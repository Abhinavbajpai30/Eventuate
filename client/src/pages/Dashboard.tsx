import React from 'react';
import Navbar from '../components/Navbar';
import EventList from '../components/EventList';
import Footer from '../components/Footer';

function Dashboard() {
  return (
    <>
      <Navbar />
      <EventList />
      <Footer />
    </>
  );
}

export default Dashboard; 