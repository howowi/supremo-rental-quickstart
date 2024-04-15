import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Table, Container, Row, Col, Modal, Button } from 'react-bootstrap';
import Login from './login';
import TopNavBarN from '../TopNavBarN';
import FooterSection from '../Footer';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

function CarDetails({ setBookingDetails }) {

  const { id } = useParams();
  const nav = useNavigate();
  const [userDataN, setUserData] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('userid'));
  const getUserId = localStorage.getItem('userid');
  const [backendData, setBackendData] = useState([]);
  const [carsCountData, setcarsCountData] = useState([]);
  const [duration, setDuration] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(moment().add(1, 'days').toDate());

  

  useEffect(() => {
    fetch(`${process.env.REACT_APP_CARLIST_URL}/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setBackendData(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [id]);

  useEffect(() => {
    fetch(`http://api-supremo.oracledemo.online/order-service/user-orders?userid=${getUserId}`)
      .then((response) => response.json())
      .then((data) => {
        setcarsCountData(data);
      })
      .catch((err) => {
        console.log('Error fetching data:', err);
      });
  }, [getUserId]);

  useEffect(() => {
    fetch(`http://api-supremo.oracledemo.online/user-service-redis/users/${getUserId}`)
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [getUserId]);

  useEffect(() => {
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
  
    const startOfDayStartDate = moment(startDate).startOf('day');
    const startOfDayEndDate = moment(endDate).startOf('day');
  
    const diffInDays = startOfDayEndDate.diff(startOfDayStartDate, 'days');
    const newDuration = diffInDays >= 0 ? diffInDays : 0;
  
    console.log("diffInDays", diffInDays);
    setDuration(newDuration);
  
    setBookingDetails({
      startDate: startDate,
      endDate: endDate,
      duration: newDuration,
    });
  }, [startDate, endDate]);
  




  const handleBooking = () => {
    if (startDate && endDate) {
      setBookingDetails((prevBookingDetails) => ({
        ...prevBookingDetails,
        startDate,
        endDate,
        duration,
      }));
    } else {
      console.error('startDate or endDate is undefined');
    }
  };

  const handleLogin = async (userData) => {
    if (userData) {
      console.log("userData ", userData);
      localStorage.setItem('userid', userData.userid);
      setToken(userData.userid);
      setUserData(userData);
    } else {
      // Handle login failure
      console.log('Login failed');
    }
  };

  const handleLogout = () => {
    // Reset userid and token
    localStorage.removeItem('userid');
    setToken(null);

    // Navigate to the root page
    nav('/');
  };

  // const handleStartDateChange = (date) => {
  //   setStartDate(date);
  //   // You can perform validation or other logic here if needed
  //   calculateDuration(date, endDate);
  // };
  const currentDate = new Date();

  const handleStartDateChange = (date) => {
    if (moment(date).isBefore(currentDate, 'day')) {
      console.error('Selected date should be equal or after the current date');
    } else if (moment(date).isAfter(endDate, 'day')) {
      console.error('Start date should be before or equal to end date');
    } else {
      setStartDate(date, () => {
        const diffInDays = moment(endDate).diff(date, 'days') + 1;
        const newDuration = diffInDays >= 0 ? diffInDays : 0;
        console.log("diffInDays start date change ", diffInDays);
        setDuration(newDuration);
      });
    }
  };
  
  const handleEndDateChange = (date) => {
    if (moment(date).isBefore(currentDate, 'day')) {
      console.error('Selected date should be equal or after the current date');
    } else if (moment(date).isBefore(startDate, 'day')) {
      console.error('End date should be after or equal to start date');
    } else {
      setEndDate(date, () => {
        const diffInDays = moment(date).diff(startDate, 'days') + 1;
        const newDuration = diffInDays >= 0 ? diffInDays : 0;
        console.log("diffInDays end date change ", diffInDays);
        setDuration(newDuration);
      });
    }
  };
  

  const calculateDuration = (start, end) => {
    const diffInDays = moment(end).diff(start, 'days') + 1;
    const newDuration = diffInDays >= 0 ? diffInDays : 0;
    setDuration(newDuration);
    setBookingDetails({
      startDate: start,
      endDate: end,
      duration: newDuration,
    });
  };

  const getDateDifference = () => {
    const diffInDays = moment(endDate).diff(startDate, 'days') + 1;
    const newDuration = diffInDays >= 0 ? diffInDays : 0;
    setDuration(newDuration);
    return newDuration;
  };



  //console.log("backendData ", backendData.name);
  if (getUserId === null) {
    // If getUserId is null, user is not logged in
    return (
      <>
        <Login onLogin={handleLogin} />
      </>
    )
  }

  return (
    <>
      <div>
        <TopNavBarN onLogout={handleLogout} userJsonVal={userDataN} bookingCount={carsCountData.length} />
        <div className="container">
          <div className="row no-gutters">
            <div className="col-md-12">
              <div className="backBtn-wrap rounded-right w-100 text-left">


              </div></div>
          </div>
        </div>
        <div className="container emptyArea">
          <div className="row no-gutters">
            <div className="col-md-12"></div>
          </div>
        </div>
        <section className="ftco-section1 bg-light">

          <div className="container">
            <div className="row no-gutters">
              <div className="col-md-12	featured-top">
                <div className="row no-gutters">
                  <div className="col-md-6 d-flex align-items-start bg-primary">

                    <form action="#" className="request-form bg-primary fadeInUp text-left w-100 cardetailsForm">
                      <h2>Vehicle Details</h2>

                      <div className="d-flex">
                        <div className="form-group">
                          <label className="labelWhiteText">Car Brand</label>
                          <label className='valueWhiteTxt'>{backendData.brand + " " + backendData.name}</label>
                        </div>
                        <div className="form-group priceTxt">
                          <label className='setenceCase' ><span className='currencyB'>$</span>{backendData.price}<span> / hr</span></label>
                        </div>
                      </div>


                      <div className="d-flex">
                        <div className="form-group mr-2">
                          <label className="labelWhiteText">Car Type</label>
                          <label className='valueWhiteTxt setenceCase'>{backendData.vehicletype}</label>
                        </div>
                        <div className="form-group ml-2">
                          <label className="labelWhiteText">Fuel Type</label>
                          <label className='valueWhiteTxt setenceCase'>{backendData.fueltype}</label>
                        </div>
                      </div>

                      <div className="d-flex">
                        <div className="form-group">
                          <label className="labelWhiteText">From Date:</label>
                          <DatePicker selected={startDate} onChange={handleStartDateChange} minDate={currentDate} required />
                        </div>
                        <div className="form-group ml-2">
                          <label className="labelWhiteText">To Date:</label>
                          {/* <DatePicker selected={endDate} onChange={handleEndDateChange} required/> */}
                          <DatePicker selected={endDate} onChange={handleEndDateChange} minDate={currentDate} required />
                        </div>
                      </div>


                      <div className="d-flex">
                        <div className="form-group ml-2">
                          <label className="labelWhiteText">Duration</label>
                          <label className="valueWhiteTxt setenceCase">
                            <input
                              type="text"
                              value={duration + (duration === 1 ? ' Day' : ' Days')}
                              readOnly
                            />
                          </label>
                        </div>
                        <div className="form-group mr-2">
                          <label className="labelWhiteText">Location</label>
                          <label className="valueWhiteTxt">{backendData.locations}</label>
                        </div>
                      </div>



                    </form>

                  </div>
                  <div className="col-md-6 d-flex align-items-top carBigImage" style={{ 'marginTop': '-40px' }}>
                    <div className="services-wrap rounded-right w-100 text-left">
                      <h3 className="heading-section mb-4">{backendData.brand + " " + backendData.name}</h3>
                      <div className="row d-flex mb-4">
                        <div className="img rounded d-flex align-items-end detailPgCarImg" style={{ 'backgroundImage': `url(/resources/images/cars/${backendData.carid}.png)` }}>

                        </div>
                      </div>
                    </div>

                  </div>
                  <div className="proceed-wrap rounded-right w-100 text-center mt-4">
                    <button className="btn btn-dark py-2 mr-2" onClick={() => nav(-1)}>
                      Back
                    </button>
                    <Link
                      to={{
                        pathname: `/carcheckout/${id}`,
                        state: {
                          bookingDetails: {
                            startDate,
                            endDate,
                            duration,
                          },
                        },
                      }}
                      className="btn btn-secondary py-2 ml-1"
                      onClick={handleBooking}
                    >
                      Proceed to Book
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>


        <FooterSection />
      </div>


    </>
  );
}

export default CarDetails;
