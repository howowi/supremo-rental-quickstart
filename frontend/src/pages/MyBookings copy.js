import React, { useState, useEffect } from 'react';
import { Table, Container, Row, Col, Modal, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import Login from './login';
import TopNavBarN from '../TopNavBarN';
import FooterSection from '../Footer';


function MyBookings({ onLogout, userJsonVal, bookingCount }) {
    const [userDataN, setUserData] = useState([userJsonVal]);
    const [carsCountData, setcarsCountData] = useState([]);
    const { id } = useParams();
    const nav = useNavigate();
    const history = useNavigate();
    //const [userDataN, setUserData] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('userid'));
    const getUserId = localStorage.getItem('userid');
    const [backendData, setBackendData] = useState([]);
    //const [carsCountData, setcarsCountData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCarId, setSelectedCarId] = useState(null);
    const [carDetails, setCarDetails] = useState({});


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


    useEffect(() => {
        console.log('Fetching data for user ID:', getUserId);
        fetch(`http://api-supremo.oracledemo.online/order-service/user-orders?userid=${getUserId}`)
            .then((response) => response.json())
            .then((data) => {
                console.log("Data from server:)) ", data);
                setBackendData(data);
                setcarsCountData(data);
            })
            .catch((err) => {
                console.log('Error fetching data:', err);
            });
    }, [getUserId]);

    const handleLogout = () => {
        // Reset userid and token
        localStorage.removeItem('userid');
        setToken(null);

        // Navigate to the root page
        nav('/');
    };

    const formatDate = (dateString) => {
        const options = {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        };

        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
        return formattedDate;
    };

    const handleOpenModal = (carId) => {
        console.log("car health check for car id", carId);
        setSelectedCarId(carId);
        setShowModal(true);

        fetch(`http://api-supremo.oracledemo.online/car-service-redis/carshealth/${carId}`)
            .then((response) => response.json())
            .then((data) => {
                console.log("Car Details:", data);
                setCarDetails(data);
            })
            .catch((err) => {
                console.log('Error fetching car details:', err);
            });
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const isBookingDateValid = (bookingDate) => {
        const currentDate = new Date();
        const bookingDateObj = new Date(bookingDate);

        // Check if booking date is equal to today's date
        return (
            bookingDateObj.getDate() === currentDate.getDate() &&
            bookingDateObj.getMonth() === currentDate.getMonth() &&
            bookingDateObj.getFullYear() === currentDate.getFullYear()
        );
    };


    if (getUserId === null) {
        history('/', {});
    }



    return (
        <>
            <div>
                {/* <TopNavBarN onLogout={handleLogout} /> */}
                <TopNavBarN onLogout={handleLogout} userID={{ 'userid': getUserId }} bookingCount={carsCountData.length} />
                <div className="container">
                    <div className="row no-gutters">
                        <div className="col-md-12">
                            <div className="backBtn-wrap rounded-right w-100 text-left">


                            </div></div>
                    </div>
                </div>
                <section className="ftco-section1 bg-light">

                    <div className="container">
                        <div className="row no-gutters">
                            <div className="col-md-12	featured-top">
                                <div className="row no-gutters">
                                    <div className="col-md-12 d-flex align-items-center bg-primary" style={{ 'marginTop': '40px', 'maxHeight': '110px' }}>

                                        <form action="#" className="request-form bg-primary fadeInUp text-left w-100 cardetailsForm">
                                            <h2>My Booking History</h2>

                                            <div className="d-flex">

                                            </div>

                                        </form>

                                    </div>
                                    <div className="col-md-12 d-flex align-items-center carBigImage">

                                        <div className="services-wrap1 rounded-right w-100 text-left">

                                            {/* <Container>
                                                <Row>
                                                    <Col>
                                                        <Table striped bordered hover>
                                                            <thead>
                                                                <tr>
                                                                    <th>Order Id</th>
                                                                    <th>Car</th>
                                                                    <th>Duration</th>
                                                                    <th>Order Date</th>
                                                                    <th>Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {backendData.length > 0 && backendData.map((orderD, index) => (
                                                                    <tr key={index}>
                                                                        <td>{orderD.orderid}</td>
                                                                        <td>{orderD.brand + ' ' + orderD.name}</td>
                                                                        <td>{orderD.duration} {orderD.duration === 1 ? 'Day' : 'Days'}</td>
                                                                        <td>{formatDate(orderD.order_when)}</td>
                                                                        <td>  {isBookingDateValid(orderD.order_when) && ( <button
                                                                            className="btn btn-primary py-2 mr-2"
                                                                            onClick={() => handleOpenModal(orderD.carid)}
                                                                            >
                                                                            Car Health
                                                                            </button>
                                                                        ) } </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </Table>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col className='text-center'>
                                                            <button className="btn btn-dark mt-4" onClick={() => nav("/")}> Home </button></Col>
                                                </Row>
                                            </Container> */}
                                            <Container>
                                                <Row>
                                                    {backendData.length > 0 && backendData.map((orderD, index) => (
                                                        <div key={index} className="col-md-4">
                                                            {/* "orderid": "O-12261628",
        "carid": "t009",#
        "userid": "JohnC",
        "duration": 1,
        "ordered": true,
        "order_when": "2023-12-18T21:21:10.656Z",
        "name": "Elantra", #
        "brand": "Hyundai", #
        "from_date": "2023-12-27T00:00:00.000Z",
        "end_date": "2023-12-28T00:00:00.000Z" */}
                                                            <div className="card shadow-sm w-100 mb-4">
                                                                <div className="img rounded d-flex align-items-end carlist" style={{ 'backgroundImage': `url(/resources/images/cars/${orderD.carid}.png)`, "height": "150px", "width": "auto" }}>
                                                                </div>
                                                                <div className="card-body">
                                                                    <div className='car-wrap'>
                                                                        <div className="text">
                                                                            <h2 className="mb-0 text-start"><a href="#">{orderD.brand} {orderD.name}</a></h2>
                                                                            <div className="d-flex mb-3">
                                                                                <span className="bookingLabel">Booked On</span>
                                                                                <p className="bookedDate ml-auto">
                                                                                    {new Date(orderD.order_when).toLocaleDateString('en-AU', {
                                                                                        day: 'numeric',
                                                                                        month: 'numeric',
                                                                                        year: 'numeric'
                                                                                    })}{' '}
                                                                                    {new Date(orderD.order_when).toLocaleTimeString('en-AU', {
                                                                                        hour: 'numeric',
                                                                                        minute: 'numeric'
                                                                                    })}
                                                                                </p>
                                                                            </div>
                                                                            <div className='d-flex justify-content-between mn-ht-details'>
                                                                                <span className="card-text"><span className="icon-calendar"> From </span> {new Date(orderD.from_date).toLocaleDateString('en-AU', {
                                                                                    day: 'numeric',
                                                                                    month: 'numeric',
                                                                                    year: 'numeric'
                                                                                })}{' '}
                                                                                    {new Date(orderD.from_date).toLocaleTimeString('en-AU', {
                                                                                        hour: 'numeric',
                                                                                        minute: 'numeric'
                                                                                    })}</span>

                                                                            </div>
                                                                            <div className='d-flex justify-content-between mn-ht-details'>
                                                                                <span className="card-text"><span className="icon-calendar"> To </span> {new Date(orderD.end_date).toLocaleDateString('en-AU', {
                                                                                    day: 'numeric',
                                                                                    month: 'numeric',
                                                                                    year: 'numeric'
                                                                                })}{' '}
                                                                                    {new Date(orderD.end_date).toLocaleTimeString('en-AU', {
                                                                                        hour: 'numeric',
                                                                                        minute: 'numeric'
                                                                                    })}</span>

                                                                            </div>

                                                                            <p className="d-flex mt-2 d-block">{isBookingDateValid(orderD.order_when) && (<button
                                                                                className="btn btn-primary py-2 mr-2"
                                                                                onClick={() => handleOpenModal(orderD.carid)}
                                                                            >
                                                                                Car Health
                                                                            </button>
                                                                            )}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </Row>
                                            </Container>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </section>


                <FooterSection />
            </div>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{carDetails.model + " " + carDetails.name} - Car Health</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container className='carHealthBody'>
                        <Row>
                            <Col style={{ 'height': '200px' }} className='col-sm-4'>
                                <div className="img rounded d-flex align-items-end carlist" style={{ 'backgroundImage': `url(/resources/images/cars/${carDetails.carid}.png)`, "height": "150px", "width": "auto" }}> </div>
                                <h5 className='carModel-Popup w-100'>{carDetails.model + " " + carDetails.name}</h5>
                            </Col>
                            <Col style={{ 'backgroundColor': '#1089ff' }} className='p-2'>
                                <Container>
                                    <Row>
                                        <Col><label className="labelWhiteText">Engine CC</label>
                                            <label className='valueWhiteTxt setenceCase'>{carDetails.enginepower}</label></Col>
                                        <Col><label className="labelWhiteText">Fuel Type</label>
                                            <label className='valueWhiteTxt setenceCase'>{carDetails.fueltype}</label></Col>
                                        <Col><label className="labelWhiteText">Mileage</label>
                                            <label className='valueWhiteTxt setenceCase'>{carDetails.mileage}</label></Col>
                                    </Row>
                                    <Row>
                                        <Col><label className="labelWhiteText">Engine Status</label>
                                            <label className='valueWhiteTxt setenceCase'>{carDetails.enginestatus}</label></Col>
                                        <Col><label className="labelWhiteText">Transmission Type</label>
                                            <label className='valueWhiteTxt setenceCase'>{carDetails.transmissiontype}</label></Col>
                                        <Col><label className="labelWhiteText">Fuel Level</label>
                                            <label className='valueWhiteTxt setenceCase'>{carDetails.fuelLevel}</label></Col>
                                    </Row>
                                    <Row>
                                        <Col><label className="labelWhiteText">Last Service Date</label>
                                            <label className='valueWhiteTxt setenceCase'>{carDetails.lastservicedate}</label></Col>

                                    </Row>
                                </Container>

                            </Col>
                        </Row>
                    </Container>

                    {/* <td>{carDetails.mileage}</td>
                        <td>{carDetails.enginepower}</td> */}


                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default MyBookings
