import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, Route } from 'react-router-dom';

import {Badge, Container, Row, Col } from 'react-bootstrap';


import Login from './login';
import TopNavBarN from '../TopNavBarN';
import FooterSection from '../Footer';


function ConfirmBooking() {
    const { id } = useParams();
    const nav = useNavigate();
    
  
    // const useRefElement = useRef();
    // const setScrollPosition = (element) => {
    //   window.scrollTo({
    //     top: element.current.offsetTop,
    //     behavior: "smooth"
    //   });
    // };
    const [userDataN, setUserData] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('userid'));
    // console.log("token is ", localStorage.getItem('userid'));
    const getUserId = localStorage.getItem('userid');
    // console.log("id ", id);
    const [backendData, setBackendData] = useState([]);
    const [carsCountData, setcarsCountData] = useState([]);


    useEffect(() => {
      fetch(`${process.env.REACT_APP_CARLIST_URL}/${id}`)
        .then((response) => response.json())
        .then((data) => {
          // console.log("from http://146.56.171.43:8081 ", id);
          setBackendData(data);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }, [id]);

    useEffect(() => {
      fetch(`http://api-supremo.oracledemo.online/user-service-redis/users/${getUserId}`)
          .then((response) => response.json())
          .then((data) => {
            // console.log("from http://146.56.171.43:8081 ", id);
            setUserData(data);
          })
          .catch((err) => {
            console.log(err.message);
          });
      }, [getUserId]);
    //console.log("userDataN ", userDataN);

    useEffect(() => {
      console.log('Fetching data for user ID:', getUserId);
      fetch(`http://api-supremo.oracledemo.online/order-service/user-orders?userid=${getUserId}`)
          .then((response) => response.json())
          .then((data) => {
              console.log("Data from server:)) ", data);
              setcarsCountData(data);
          })
          .catch((err) => {
              console.log('Error fetching data:', err);
          });
  }, [getUserId]);   
  
    const handleLogin = async (userData) => {
      if (userData) {
        setToken(userData.userid);
        localStorage.setItem('userid', userData.userid);
        setUserData(userData); // Pass the userData to the parent component
      } else {
        // Handle login failure
        console.log('Login failed');
      }
    };
  
    const handleLogout = () => {
      // Reset userid and token
      localStorage.removeItem('userid');
      setToken(null);
        console.log("logout trigerred ");
      // Navigate to the root page
      nav('/');
    };
  
    //console.log("backendData ", backendData.name);
    if (getUserId === null) {
      // If getUserId is null, user is not logged in
      return (
        <>
          <Login onLogin={handleLogin} />
        </>
      )}
        
    return (
        <>
      <div>
      <TopNavBarN onLogout={handleLogout}  bookingCount={carsCountData.length}/>
          <div className="container">
                <div className="row no-gutters">
                    <div className="col-md-12">
                <div className="backBtn-wrap rounded-right w-100 text-left">
               
                          
                          </div></div>
                          </div>
                          </div>
              <section className="ftco-section2 bg-light">
              
                <div className="container">
                <div className="col-md-12">
                  <div className="row no-gutters">
                    <div className="col-md-12">
                      <div className="row no-gutters">
                      
                        <div className="col-md-4 d-flex align-items-center bg-primary">
                          
                                      <form action="#" className="request-form bg-primary fadeInUp text-left w-100 cardetailsForm">
                                    <h2>Vehicle Details</h2> 
                            <div className="form-group">
                              <label  className="labelWhiteText">Car Brand</label>
                              <label className='valueWhiteTxt'>{backendData.brand + " " +backendData.name}</label>
                            </div>
                            
                            <div className="d-flex">
                              <div className="form-group mr-2">
                                <label  className="labelWhiteText">Car Type</label>
                                <label className='valueWhiteTxt setenceCase'>{backendData.vehicletype}</label>
                              </div>
                              <div className="form-group ml-2">
                              <label  className="labelWhiteText">Fuel Type</label>
                              <label className='valueWhiteTxt setenceCase'>{backendData.fueltype}</label>
                              </div>
                              
                            </div>

                            <div className='d-flex'>
                            <div className="form-group mr-2">
                              <label  className="labelWhiteText">Location</label>
                              <label className='valueWhiteTxt'>{backendData.locations}</label>
                            </div>
  
                            <div className="form-group ml-2"><label  className="labelWhiteText">Price</label>
                              <label className='valueWhiteTxt'><span className='currencyB'>$</span>{backendData.price}<span> / hr</span></label>
                            </div>
                            </div>

                            <h2>Driver Details</h2>
                            <div className='d-flex'>
                            <div className="form-group mr-2">
                              <label  className="labelWhiteText">Fullname</label>
                              <label className='valueWhiteTxt'>{userDataN.fullname}</label>
                            </div>
  
                            <div className="form-group ml-2"><label  className="labelWhiteText">Mobile</label>
                            <label className='valueWhiteTxt'>{userDataN.mobile}</label>
                            </div>
                            </div>

                            <div className='d-flex'>
                            <div className="form-group mr-2">
                              <label  className="labelWhiteText">Country</label>
                              <label className='valueWhiteTxt'>{userDataN.country}</label>
                            </div>
  
                            {/* <div className="form-group ml-2"><label  className="labelWhiteText">Mobile</label>
                            <label className='valueWhiteTxt'>{userDataN.mobile}</label>
                            </div> */}
                            </div>

                            
                           
  
                          </form>
                                  
                        </div>
                        <div className="col-md-8 d-flex align-items-center carBigImage" style={{'marginTop':'-40px'}}>
                          <div className="services-wrap rounded-right w-100 text-left">
                            <h3 className="heading-section mb-4"><Link to={`/`} className="btn btn-dark py-2 mr-2">Home</Link> {backendData.brand + " " +backendData.name} </h3>
                            <div className="row d-flex mb-4">
                            <div className="img rounded d-flex align-items-end detailPgCarImg" style={{ 'backgroundImage': `url(/resources/images/cars/${backendData.carid}.png)`}}>
                            <div className="proceed-wrap rounded-right w-100 text-center">
                           <h2 variant="success"><Badge bg="success">Booking Confirmed</Badge></h2>
                           
                          </div>
                            </div>
                            </div>
                          </div>
                          
                        </div>
  
                        </div>
                      </div>
                  </div>
                </div>
              </div>   
  
              </section>
  
  
        <FooterSection/>
      </div>
      </>
    );
  }

export default ConfirmBooking
