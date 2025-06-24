import React from 'react';
import Header from '../components/Header';
import KeyrouteHeroSection from '../components/Home/Section1';
import KeyRouteAboutSection from '../components/Home/Section3';
import Section4 from '../components/Home/Section4';
import KeyRouteApp from '../components/Home/Section2';

function Home() {
  return (
    <div>
      <Header></Header>
      <div className='mt-20'>
        <KeyrouteHeroSection></KeyrouteHeroSection>
      </div>
      <div>
        <KeyRouteApp></KeyRouteApp>
      </div>
      <div>
        <KeyRouteAboutSection></KeyRouteAboutSection>
      </div>
      <div>
        <Section4></Section4>
      </div>
    </div>
  );
}

export default Home;
