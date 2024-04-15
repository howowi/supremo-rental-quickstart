import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, Route } from 'react-router-dom';
import { Table, Container, Row, Col, Modal, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

  const [showPostgreModal, setShowPostgreModal] = useState(false);
  const [showRedisModal, setRedisModal] = useState(false);
  const [showAJSONModal, setAJSONModal] = useState(false);

  const handleOpenPostgreModal = () => { setShowPostgreModal(true); };
  const handleClosePostgreModal = () => { setShowPostgreModal(false); };
  const handleOpenRedisModal = () => { setRedisModal(true); };
  const handleCloseRedisModal = () => { setRedisModal(false); };
  const handleOpenAJSONModal = () => { setAJSONModal(true); };
  const handleCloseAJSONModal = () => { setAJSONModal(false); };

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
    fetch("http://api-supremo.oracledemo.online/car-service-redis/cars" + `/${id}`)
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
            <div className="col-md-12 p-0">
              <div className='otherSectionOuter col-md-12 mb-3 userDetails'>
                <div className="col-md-12 align-items-center ">
                  <div className="col-md-12">
                    <h3>User Details</h3>
                    <div>  </div>
                  </div>
                  <button className="btn py-2 ml-2 forNoSQLdialogBtn redislbtn1" onClick={() => handleOpenRedisModal()} ><img src='/resources/images/idea-bulb.svg'/></button>
                  
                  <div className="col-md-12">
                    <Container>
                      <Row>
                      <Col className="col-md-3 align-items-start">
                        <div className="img rounded d-flex align-items-end userdetailImg-200" style={{ 'backgroundImage': `url(/resources/images/${userDataN.userid}.png)` }}>
                          <div className="proceed-wrap rounded-right w-100 text-center"></div>
                        </div>
                      </Col>
                    <Col className="col-md-9 align-items-start">
                              <Row>
                        <Col className='col-3'><div className='rdOnlyLabel'>Fullname</div>
                          <div className='rdOnlyValue'>{userDataN.fullname}</div></Col>
                        <Col className='col-3'><div className='rdOnlyLabel'>Email</div>
                          <div className='rdOnlyValue'>{userDataN.email}</div></Col>
                        <Col className='col-3'><div className='rdOnlyLabel'>Mobile</div>
                          <div className='rdOnlyValue'>{userDataN.mobile}</div></Col>


                        <Col className='col-3'><div className='rdOnlyLabel'>Country</div>
                          <div className='rdOnlyValue'>{userDataN.country}</div></Col>
                        <Col className='col-3'><div className='rdOnlyLabel'>Member Since</div>
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
                        <Col className='col-3'>
                          <div className='rdOnlyLabel'>From Date</div>
                          <div className='rdOnlyValue'>{formatDate(startDate)}</div>
                        </Col>
                        <Col className='col-3'>
                          <div className='rdOnlyLabel'>To Date</div>
                          <div className='rdOnlyValue'>{formatDate(endDate)}</div>
                        </Col>
                        <Col className='col-3'>
                          <div className='rdOnlyLabel'>Durations</div>
                          <div className='rdOnlyValue'>{duration + (duration === 1 ? ' Day' : ' Days')}</div>
                        </Col>
                      </Row>
                      </Col>
                      

                      </Row>
                    </Container>

                  </div>


                  {/* <button className="btn btn-dark py-2 mr-2" onClick={() => nav(-1)}> Back </button>
                          <Link to={`/proceed/`} className="btn btn-secondary py-2 ml-1">Proceed to Book</Link> */}
                </div>
              </div>
              <div className='d-flex container pl-0'>
              <div className='otherSectionOuter col-md-9 mb-3 p-0'>
                <div className="col-md-12 align-items-start pt-3">
                  <div className="col-md-12">
                    <h3>Vehicle Details</h3>
                    <div>

                    </div>
                  </div>
                  
                  <button className="btn py-2 ml-2 forNoSQLdialogBtn ajsonbtn1" onClick={() => handleOpenAJSONModal()} ><img src='/resources/images/idea-bulb.svg'/></button>
                  <div className="col-md-12 align-items-start">
                    <Row>
                      <Col className="col-md-3 align-items-start">
                        <div className="img rounded d-flex align-items-end detailPgCarImg-200" style={{ 'backgroundImage': `url(/resources/images/cars/${backendData.carid}.png)` }}>
                          <div className="proceed-wrap rounded-right w-100 text-center"></div>
                        </div>
                      </Col>
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

                    </Row>
                  </div>


                  {/* <button className="btn btn-dark py-2 mr-2" onClick={() => nav(-1)}> Back </button>
                          <Link to={`/proceed/`} className="btn btn-secondary py-2 ml-1">Proceed to Book</Link> */}
                </div>
              </div>

              <div className='otherSectionOuter col-md-3 mb-3 ml-3 p-0'>
                <div className="col-md-12 align-items-start pt-3">
                  <div className="col-md-12">
                    <h3>Payment Details</h3>
                    <div>

                    </div>
                  </div>
                  <div className="col-md-12 align-items-start">

                    <Row>
                      <Col><div className='rdOnlyLabel'>Payment Type</div>
                        <div className='rdOnlyValue'><img src='/resources/images/credit-card.png' /> Credit Card</div></Col>
                    </Row>



                  </div>


                  {/* <button className="btn btn-dark py-2 mr-2" onClick={() => nav(-1)}> Back </button>
                          <Link to={`/proceed/`} className="btn btn-secondary py-2 ml-1">Proceed to Book</Link> */}
                </div>
              </div>
</div>
              <div className='otherSectionOuter col-md-12 mt-3 pt-3 pb-3'>
                <div className="col-md-12 d-block align-items-center " style={{ 'textAlign': 'center' }}>
                  <button className="btn btn-dark py-2 mr-2" onClick={() => nav(-1)}> Back </button>
                  <button onClick={handleCheckout} className='btn btn-secondary py-2 ml-1'>Confirm Booking</button>
                  {/* <Link to={`/confirmbooking/${id}`} className="btn btn-secondary py-2 ml-1">Confirm Booking</Link> */}
                </div>
              </div>


              <div className="row no-gutters">

                <div className="col-md-12">
                  <div className='row'>



                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>


        <FooterSection />
      </div>



      <Modal show={showPostgreModal} onHide={handleClosePostgreModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>PostgreSQL with Redis</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container className='carHealthBody'>
            <Row>
              <Col className='col-12'>
                <p><strong>Type</strong>:&nbsp;Relational</p>
                <p><strong>Why?</strong>:&nbsp;</p>
                <ul>
                  <li>ACID compliant, high performance, highly scalable open source transactional database</li>
                  <li>Excellent for handling day to day & data intensive operations like car booking & can scale-out on demand</li>
                </ul>
                <p><strong>OCI Differentiator</strong>:&nbsp;Powered by Optimized storage offering high-scale, high availability, high performance, zero RPO, low RTO & low-cost database service</p>
                <p><strong>Outcome</strong>:&nbsp;Data Integrity, Read Consistency, High Availability, Zero RPO</p>
                <p><em><strong>Find out more</strong></em>:&nbsp;<a href="https://www.oracle.com/cloud/postgresql/">Link</a></p>
              </Col>
            </Row>
          </Container>

          {/* <td>{carDetails.mileage}</td>
                        <td>{carDetails.enginepower}</td> */}


        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePostgreModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showRedisModal} onHide={handleCloseRedisModal} className='userDetailsPop' centered>
        <Modal.Header closeButton>
          <Modal.Title>PostgreSQL with Redis</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container className='carHealthBody'>
            <Row>
              <Col className='col-12'>
              <p><img src='/resources/images/popup-img/posgresql_with_redis.svg'/></p>
              </Col>
            </Row>
          </Container>

          {/* <td>{carDetails.mileage}</td>
                        <td>{carDetails.enginepower}</td> */}


        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRedisModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showAJSONModal} onHide={handleCloseAJSONModal} className='vehDetailsPop' centered>
        <Modal.Header closeButton>
          <Modal.Title>AJSON with Redis</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container className='carHealthBody'>
            <Row>
              <Col className='col-12'>
              <p><img src='/resources/images/popup-img/AJSON_with_redis.svg'/></p>
              </Col>
            </Row>
          </Container>

          {/* <td>{carDetails.mileage}</td>
                        <td>{carDetails.enginepower}</td> */}


        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAJSONModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


    </>
  );
}

export default CarCheckOut
