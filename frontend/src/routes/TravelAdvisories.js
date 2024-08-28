import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import AdvisoriesData from '../components/AdvisoriesData';
import ClinicData from '../components/ClinicData';

const TravelAdvisories = () => {
  return (
    <>
      <Navbar />
      <Hero
        cName="hero-mid"
        heroImg="https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        title="Travel Advisories"
        btnClass="hide"
      />
      <AdvisoriesData />
      <hr></hr>
      <ClinicData />
      <br></br>
      <Footer />
    </>
  );
};

export default TravelAdvisories;
