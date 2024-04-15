import React, { Component } from 'react'
import HeroSection from './HeroSection';
import CarList from './carlist';
import carData from './carlist.json'; 
import ServicesSection from './Services';
function HomeSection() {
  return (
        <>
          <div>
            <HeroSection/>
            <CarList/>
            <ServicesSection/>
          </div>
        </>
  );
}

export default HomeSection;


