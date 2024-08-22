import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AdvisoriesData from '../components/AdvisoriesData';
import ClinicData from '../components/ClinicData';

const TravelAdvisories = () => {
  return (
    <>
      <Navbar />
      <AdvisoriesData />
      <hr></hr>
      <ClinicData />
      <br></br>
      <Footer />
    </>
  );
};

export default TravelAdvisories;
