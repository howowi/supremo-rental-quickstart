import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


import Login from './login';
import TopNavBarN from '../TopNavBarN';
import FooterSection from '../Footer';

function CarCheckOut({ bookingDetails }) {
    // const [userDataN, setUserData] = useState([userJsonVal]);
    // const [carsCountData, setcarsCountData] = useState([bookingCount]);
    // const [dataHistory, setDataHistory] = useState([backendDataHistory])
  const { id } = useParams();
  const nav = useNavigate();
  const location = useLocation();
  console.log('Location state:', location.state);
  const { startDate, endDate, duration } = bookingDetails;
  const formattedStartDate = startDate ? startDate.toLocaleDateString() : '';
  const formattedEndDate = endDate ? endDate.toLocaleDateString() : '';

  console.log('startDate:', startDate);
  console.log('endDate:', endDate);
  console.log('duration val:', duration);

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

  // const startDateVal = useState(startDate);
  // console.log("id ", id);
  const [backendData, setBackendData] = useState([]);
  const [carsCountData, setcarsCountData] = useState([]);


 
  useEffect(() => {
    fetch("http://api-supremo.oracledemo.online/car-service-redis/cars"+`/${id}`)
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

  useEffect(() => {
    fetch(`${process.env.REACT_APP_GET_USER_BY_ID}${getUserId}`)
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

    // Navigate to the root page
    nav('/');
  };

  const formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

  let bookingData = JSON.stringify({
    "userid": getUserId,
    "carid": backendData.carid,
    "brand": backendData.brand,
    "name": backendData.name,
    "from_date": formatDate(startDate),
    "end_date": formatDate(endDate),
    "duration": duration,
    "ordered": "TRUE"
  });


  const handleCheckout = async () => {
    // Call your authentication API with username and password
    //console.log("api calling ", process.env.REACT_APP_CREATE_ORDER_API);
    const response = await fetch("http://api-supremo.oracledemo.online/order-service/create-order", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: bookingData,
    });

    const bookingRespData = await response.json();

    // Assuming your API returns a token on successful login
    if (bookingRespData) {
      console.log(" Order Creatded", bookingRespData);
      nav(`/confirmbooking/${id}`);
      // Pass the token to the parent component
    } else {
      // Handle login failure
    }
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
        <section className=" bg-light">
          
          <div className="container">
            <div className="col-md-12">
            <div className='otherSectionOuter col-md-12 mb-5'>
                        <div className="col-md-12 align-items-center ">
                          <div className="col-md-12">
                            <h3>User Details</h3>
                            <div>

                            </div>
                          </div>
                          <div className="col-md-12">
                            <Container>
                            <Col className="col-md-9 align-items-start">
                              <Row>
                              <Row>
                                <Col className='col-4'><div className='rdOnlyLabel'>Fullname</div>
                                  <div className='rdOnlyValue'>{userDataN.fullname}</div></Col>
                                <Col className='col-4'><div className='rdOnlyLabel'>Email</div>
                                  <div className='rdOnlyValue'>{userDataN.email}</div></Col>
                                  <Col className='col-4'><div className='rdOnlyLabel'>Mobile</div>
                                  <div className='rdOnlyValue'>{userDataN.mobile}</div></Col>
                              </Row>
                              <Row>
                                
                                <Col className='col-4'><div className='rdOnlyLabel'>Country</div>
                                  <div className='rdOnlyValue'>{userDataN.country}</div></Col>
                                <Col className='col-8'><div className='rdOnlyLabel'>Member Since</div>
                                  <div className='rdOnlyValue'>
                                  {new Date(userDataN.membersince).toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    })}{' '}
    {new Date(userDataN.membersince).toLocaleTimeString('en-AU', {
        hour: 'numeric',
        minute: 'numeric'
    })}
                                  </div></Col>
                                {/* <Col> </Col> */}
                              </Row>
                              <Row>
                                <Col>
                                  <div className='rdOnlyLabel'>From Date</div>
                                  <div className='rdOnlyValue'>{formatDate(startDate)}</div>
                                </Col>
                                <Col>
                                  <div className='rdOnlyLabel'>To Date</div>
                                  <div className='rdOnlyValue'>{formatDate(endDate)}</div>
                                </Col>
                                <Col>
                                  <div className='rdOnlyLabel'>Durations</div>
                                  <div className='rdOnlyValue'>{duration + (duration === 1 ? ' Day' : ' Days')}</div>
                                </Col>
                              </Row>
                              </Row>
                              </Col>
                              
                            </Container>

                          </div>


                          {/* <button className="btn btn-dark py-2 mr-2" onClick={() => nav(-1)}> Back </button>
                          <Link to={`/proceed/`} className="btn btn-secondary py-2 ml-1">Proceed to Book</Link> */}
                        </div>
                      </div>

                      <div className='otherSectionOuter col-md-12 mb-5'>
                        <div className="col-md-12 align-items-start ">
                          <div className="col-md-12">
                            <h3>Vehicle Details</h3>
                            <div>

                            </div>
                          </div>
                          <div className="col-md-12 align-items-start">
                <Row>
                              <Col className="col-md-9 align-items-start">
                              <Row>
                                <Col className='col-4'><div className='rdOnlyLabel'>Car Brand</div>
                                  <div className='rdOnlyValue'>{backendData.brand + " " + backendData.name}</div></Col>
                                <Col className='col-4'><div className='rdOnlyLabel'>Car Type</div>
                                  <div className='rdOnlyValue'>{backendData.vehicletype}</div></Col>
                                  <Col className='col-4'><div className='rdOnlyLabel'>Fuel Type</div>
                                  <div className='rdOnlyValue'>{backendData.fueltype}</div></Col>
                                  
                               <Col className='col-8'><div className='rdOnlyLabel'>Location</div>
                                  <div className='rdOnlyValue'>{backendData.locations}</div></Col>
                                  <Col className='col-4'><div className='rdOnlyLabel'>Price / Hr</div>
                                  <div className='rdOnlyValue'><span className='currencyB'>$</span>{backendData.price}</div></Col>
                                  </Row>
                                </Col>
                                <Col className="col-md-3 align-items-start">
                                  <div className="img rounded d-flex align-items-end detailPgCarImg-200" style={{ 'backgroundImage': `url(/resources/images/cars/${backendData.carid}.png)` }}>
                                <div className="proceed-wrap rounded-right w-100 text-center"></div>
                              </div>
                              </Col>
</Row>
                          </div>


                          {/* <button className="btn btn-dark py-2 mr-2" onClick={() => nav(-1)}> Back </button>
                          <Link to={`/proceed/`} className="btn btn-secondary py-2 ml-1">Proceed to Book</Link> */}
                        </div>
                      </div>         


              <div className="row no-gutters">
                
                <div className="col-md-12">
                  <div className="row no-gutters">

                    <div className="col-md-4 d-flex align-items-center bg-primary">

                      <form action="#" className="request-form bg-primary fadeInUp text-left w-100 cardetailsForm">
                        <h2>Vehicle Details</h2>
                        

                        <div className="form-group">
                          <label className="labelWhiteText">Car Brand</label>
                          <label className='valueWhiteTxt'>{backendData.brand + " " + backendData.name}</label>
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
                        <div className="form-group">
                          <label className="labelWhiteText">Location</label>
                          <label className='valueWhiteTxt'>{backendData.locations}</label>
                        </div>

                        <div className="form-group priceTxt">
                          <label className='setenceCase' ><span className='currencyB'>$</span>{backendData.price}<span> / hr</span></label>
                        </div>
                        
                          
                        <div className="img rounded d-flex align-items-end detailPgCarImg" style={{ 'backgroundImage': `url(/resources/images/cars/${backendData.carid}.png)` }}>
                            <div className="proceed-wrap rounded-right w-100 text-center">

                            </div>
                          </div>

                      </form>

                    </div>
                    <div className="col-md-4 d-flex align-items-center bg-secondary">
                    <div className="col-md-12 align-items-start mt-4 ">
                    <form action="#" className="request-form fadeInUp text-left w-100">
                          <div className="col-md-12 ">
                            <h3>User Details</h3>
                            <div>

                            </div>
                          </div>
                          <div className="col-md-12">
                            <Container>
                              <Row>
                                <Col className='col-6'><div className='rdOnlyLabel'>Fullname</div>
                                  <div className='rdOnlyValue'>{userDataN.fullname}</div></Col>
                               
                                  <Col className='col-6'><div className='rdOnlyLabel'>Mobile</div>
                                  <div className='rdOnlyValue'>{userDataN.mobile}</div></Col>
                                  <Col className='col-6'><div className='rdOnlyLabel'>Country</div>
                                  <div className='rdOnlyValue'>{userDataN.country}</div></Col>
                              </Row>
                              <Row>
                                
                              <Col className='col-12'><div className='rdOnlyLabel'>Email</div>
                                  <div className='rdOnlyValue'>{userDataN.email}</div></Col>
                                <Col className='col-12'><div className='rdOnlyLabel'>Member Since</div>
                                  <div className='rdOnlyValue'>
                                  {new Date(userDataN.membersince).toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    })}{' '}
    {new Date(userDataN.membersince).toLocaleTimeString('en-AU', {
        hour: 'numeric',
        minute: 'numeric'
    })}
                                  </div></Col>
                                {/* <Col> </Col> */}
                              </Row>
                              <Row>
                                <Col className='col-6'>
                                  <div className='rdOnlyLabel'>From Date</div>
                                  <div className='rdOnlyValue'>{formatDate(startDate)}</div>
                                </Col>
                                <Col className='col-6'>
                                  <div className='rdOnlyLabel'>To Date</div>
                                  <div className='rdOnlyValue'>{formatDate(endDate)}</div>
                                </Col>
                                <Col className='col-6'>
                                  <div className='rdOnlyLabel'>Durations</div>
                                  <div className='rdOnlyValue'>{duration + (duration === 1 ? ' Day' : ' Days')}</div>
                                </Col>
                              </Row>
                            </Container>

                          </div>
                          </form>


                          {/* <button className="btn btn-dark py-2 mr-2" onClick={() => nav(-1)}> Back </button>
                          <Link to={`/proceed/`} className="btn btn-secondary py-2 ml-1">Proceed to Book</Link> */}
                        </div>
                    </div>


                    <div className="col-md-8 d-flex align-items-center carBigImage" style={{ 'marginTop': '-40px' }}>
                      <div className="services-wrap rounded-right w-100 text-left">
                        <h3 className="heading-section mb-4">{backendData.brand + " " + backendData.name}</h3>
                        <div className="row d-flex mb-4">
                          <div className="img rounded d-flex align-items-end detailPgCarImg" style={{ 'backgroundImage': `url(/resources/images/cars/${backendData.carid}.png)` }}>
                            <div className="proceed-wrap rounded-right w-100 text-center">

                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                    <div className='row'>
                      <div className='otherSectionOuter col-md-12 mt-3 p-5'>
                        <div className="col-md-12 d-flex align-items-center ">
                          <div className="col-md-3">
                            <h3>Payment Details</h3>
                            <div>

                            </div>
                          </div>
                          <div className="col-md-9">
                            <Container>
                              <Row>
                                <Col><div className='rdOnlyLabel'>Payment Type</div>
                                  <div className='rdOnlyValue'><img src='/resources/images/credit-card.png' /> Credit Card</div></Col>
                              </Row>

                            </Container>

                          </div>


                          {/* <button className="btn btn-dark py-2 mr-2" onClick={() => nav(-1)}> Back </button>
                          <Link to={`/proceed/`} className="btn btn-secondary py-2 ml-1">Proceed to Book</Link> */}
                        </div>
                      </div>

                      <div className='otherSectionOuter col-md-12 mt-3 p-5'>
                        <div className="col-md-12 d-block align-items-center " style={{ 'textAlign': 'center' }}>
                          <button className="btn btn-dark py-2 mr-2" onClick={() => nav(-1)}> Back </button>
                          <button onClick={handleCheckout} className='btn btn-secondary py-2 ml-1'>Confirm Booking</button>
                          {/* <Link to={`/confirmbooking/${id}`} className="btn btn-secondary py-2 ml-1">Confirm Booking</Link> */}
                        </div>
                      </div>


                    </div>
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

export default CarCheckOut
