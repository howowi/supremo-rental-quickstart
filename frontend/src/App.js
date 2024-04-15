import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/animate.css';
import './css/owl.theme.default.min.css';
import './css/magnific-popup.css';
import './css/aos.css';
import './css/ionicons.min.css';
import './css/bootstrap-datepicker.css';
import './css/jquery.timepicker.css';
import './css/flaticon.css';
import './css/icomoon.css';
import './css/style.css';

import '@popperjs/core';

import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap JS 
import 'owl.carousel/dist/assets/owl.carousel.css'; // Import Owl Carousel CSS
// import 'owl.carousel';
import 'magnific-popup';
import 'aos/dist/aos.css'; // Import AOS CSS
import 'aos';
// import 'animate-number-component';
import 'bootstrap-datepicker';
// import 'jquery-timepicker';
import 'scrollax';

import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';

import TopNavBarN from './TopNavBarN';
import HeroSection from './HeroSection'
import SearchSection from './SearchSection';
import CarList from './carlist';
// import backendData from './carlist.json'; 
import ServicesSection from './Services';
import FooterSection from './Footer';
import Login from './pages/login';
import { useNavigate, useLocation } from 'react-router-dom';

import { library } from '@fortawesome/fontawesome-svg-core'

// import your icons
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'

//import backendData from './carlist.json';

function App(backendData, setShowPopular, setShowFilter, setFilterOptions) {
  const history = useNavigate();
  const location = useLocation();
  const getUserId = localStorage.getItem('userid');
  console.log("getUserId ", getUserId);


  const [userData, setUserData] = useState([]);
  const [backendDataCars, setBackendDataCars] = useState([]);
  const [backendBookingData, setBackendBookingData] = useState([]);
  const [filteredDataCars, setFilteredDataCars] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [clearFiltersFunction, setClearFiltersFunction] = useState(() => () => { });

  const handleLogout = () => {
    setToken(null);
    setUserData([]);
    localStorage.removeItem('userid'); // Change from 'token' to 'userid'

  };

  const handleLogin = (loginResponse) => {
    console.log("Received login response: ", loginResponse);
    if (loginResponse.code === 0 && loginResponse.msg === "OK") {
      setToken(loginResponse.userid);
      localStorage.setItem('userid', loginResponse.userid);

      // Set the clearFilters function when the user logs in
      setClearFiltersFunction(() => () => {
        // Implement your clearFilters logic here
        setShowPopular(false);
        setShowFilter(false);
        setFilterOptions({
          brand: [],
          vehicletype: [],
          fueltype: [],
          locations: [],
        });
      });

    } else {
      // Handle login failure
      console.log('Login failed');
    }
  };

  // 

  // const [backendBookingData, setBackendBookingData] = useState([]);
  // const [filteredDataCars, setFilteredDataCars] = useState([]);

  useEffect(() => {
    // Fetch booking data
    fetch(`http://api-supremo.oracledemo.online/order-service/user-orders?userid=${getUserId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Data from server:>> ", data);
        setBackendBookingData(data);
      })
      .catch((err) => {
        console.log('Error fetching data:', err);
      });

    // Fetch car data
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://api-supremo.oracledemo.online/user-service-redis/users/${getUserId}`);
        const userData = await response.json();
        setUserData(userData);

        const carListResponse = await fetch(process.env.REACT_APP_CARLIST_URL);
        const carListData = await carListResponse.json();
        setBackendDataCars(carListData);
        setFilteredDataCars(carListData);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    if (getUserId) {
      fetchUserData();
    } else {
      // Redirect to login page if userId is null
      history('/login', {});
    }
  }, [getUserId, history]);


  const handleFilterChange = (searchValue) => {
    if (!searchValue) {
      // If searchValue is empty, reset to the original data
      setFilteredDataCars(backendDataCars);
    } else {
      // Filter the backendData based on the searchValue
      const filtered = backendDataCars.filter((item) => {
        const searchTerm = searchValue.toLowerCase();
        const brandNameBrand = item.brand.toLowerCase();
        const brandNameVal = item.name.toLowerCase();
        const brandFuelType = item.fueltype.toLowerCase();
        const brandVehType = item.vehicletype.toLowerCase();

        return (
          brandNameBrand.includes(searchTerm) ||
          brandNameVal.includes(searchTerm) ||
          brandFuelType.includes(searchTerm) ||
          brandVehType.includes(searchTerm)
        );
      });

      setFilteredDataCars(filtered);
    }
  };



  if (getUserId === null) {
    history('/login', {});
  }
  //const bookingCount = filteredDataCars.length;
  return (


    <div className="App">
      <TopNavBarN
        onLogout={handleLogout}
        userJsonVal={userData.userid}
        data={backendDataCars}
        bookingCount={backendBookingData.length}
        clearFilters={clearFiltersFunction} // Pass clearFilters function here
      />
      <HeroSection />
      <SearchSection placeholder="Search" data={backendDataCars} onFilterChange={handleFilterChange} />
      <CarList
        backendData={filteredDataCars}
        setShowPopular={setShowPopular}
        setShowFilter={setShowFilter}
        setFilterOptions={setFilterOptions}
      />
      <ServicesSection />
      <FooterSection />
    </div>

  );
}

export default App;
library.add(fab, fas, far)
