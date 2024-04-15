import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import AboutUs from './pages/AboutUs';
import Faq from './pages/faq';
import CarDetails from './pages/CarDetails';
import CarCheckOut from './pages/CarCheckOut';
import ConfirmBooking from './pages/ConfirmBooking';
import Login from './pages/login';
import Profile from './pages/profile';
import MyBookings from './pages/MyBookings';
import AskMe from './pages/AskMe';

const AppContainer = () => {
  const [bookingDetails, setBookingDetails] = useState({});

  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login name={"sandy"} />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/faq" element={<Faq />} />
        <Route
          path="/cardetails/:id"
          element={<CarDetails setBookingDetails={setBookingDetails} />}
        />
        <Route
          path="/carcheckout/:id"
          element={<CarCheckOut bookingDetails={bookingDetails} />}
        />
        <Route path="/confirmbooking/:id" element={<ConfirmBooking />} />
        <Route path="/mybookings" element={<MyBookings  bookingDetails={bookingDetails}  />} />
        <Route path="/profile" element={<Profile  bookingDetails={bookingDetails} />} />
        <Route path="/AskMe" element={<AskMe />} />
      </Routes>
    </Router>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <AppContainer />
  </React.StrictMode>,
  document.getElementById('root')
);
