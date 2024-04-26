import React, { useState, useEffect } from 'react';
import { Table, Container, Row, Col, Modal, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TopNavBarN from '../TopNavBarN';
import FooterSection from '../Footer';

function MyBookings({ onLogout, userJsonVal, bookingCount }) {
    const [userDataN, setUserData] = useState([userJsonVal]);
    const [carsCountData, setcarsCountData] = useState([]);
    const { id } = useParams();
    const nav = useNavigate();
    const history = useNavigate();
    const [token, setToken] = useState(localStorage.getItem('userid'));
    const getUserId = localStorage.getItem('userid');

    const [selectedCarId, setSelectedCarId] = useState(null);
    const [carDetails, setCarDetails] = useState({});
    const [expandedRow, setExpandedRow] = useState(null);

    const [showNoSQLModal, setShowNoSQLModal] = useState(false);
    const [showPostgreModal, setShowPostgreModal] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');

    const [originalData, setOriginalData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        setShowNoSQLModal(false);
        setShowPostgreModal(false);
        console.log("useeffect called ");
    }, []);

    const handleOpenNoSQLModal = () => {
        setShowNoSQLModal(true);
    };

    const handleCloseNoSQLModal = () => {
        setShowNoSQLModal(false);
    };

    const handleOpenPostgreModal = () => {
        setShowPostgreModal(true);
    };

    const handleClosePostgreModal = () => {
        setShowPostgreModal(false);
    };

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

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20); // Adjust the number of items per page as needed


    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_SERVICE_IP}/user-service-redis/users/${getUserId}`)
            .then((response) => response.json())
            .then((data) => {
                // console.log("from http://146.56.171.43:8081 ", id);
                setUserData(data);
            })
            .catch((err) => {
                console.log(err.message);
            });

        console.log('Fetching data for user ID:', getUserId);


        fetch(`${process.env.REACT_APP_BACKEND_SERVICE_IP}/order-service/user-orders?userid=${getUserId}&limit=${itemsPerPage}&offset=${indexOfFirstItem}`)
            .then((response) => response.json())
            .then((data) => {
                console.log("Data from server:", data);
                setOriginalData(data);
                setFilteredData(data); // Initially, filtered data is the same as original data
                setcarsCountData(data);
            })
            .catch((err) => {
                console.log('Error fetching data:', err);
            });
    }, [getUserId]);

    const nextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    const setPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

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

    const formatDateNew = (dateString) => {
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        };

        const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(new Date(dateString));
        return formattedDate;
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

    const expandRowDataVal = (carId, row) => {
        console.log("car health check for car id", carId);
        setSelectedCarId(carId);

        fetch(`${process.env.REACT_APP_BACKEND_SERVICE_IP}/car-health/cars/${carId}`)
            .then((response) => response.json())
            .then((data) => {
                console.log("Car Details:", data);
                setCarDetails(data);

                setExpandedRow((prevExpandedRow) =>
                    prevExpandedRow === row ? null : row
                );
            })
            .catch((err) => {
                console.log('Error fetching car details:', err);
            });
    };



    const handleToggleRow = (row, rowIndex) => {
        console.log("Clicked row:", row, typeof (row));
        console.log("Clicked row index:", rowIndex);

        if (typeof (row) === 'number' && row >= 0) {
            console.log("Original data:", row);
            const carId = rowIndex; // Assuming carid is the property that identifies the row

            if (carId) {
                console.log("var Id ", row);
                expandRowDataVal(carId, row);

            } else {
                console.error("Invalid row data - missing carId property:", row);
            }

        } else {
            console.error("Invalid row data:", row);
        }
    };

    useEffect(() => {
        console.log("Expanded Row:", expandedRow);
    }, [expandedRow]);



    

    const handleSearchInputChange = (e) => {
        const query = e.target.value.trim();
        setSearchQuery(query);

        if (query === '') {
            setFilteredData(originalData);
            setCurrentPage(1); // Reset current page to 1
        } else {
            // Filter original data based on search query
             const filtered = originalData.filter((item) =>
             item.orderid.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredData(filtered);
            //setBackendData(filtered);
            setCurrentPage(1); // Reset current page to 1
        }

    };




    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);


    const renderPagination = () => {
        const pageNumbers = [];
        // console.log("backendData 1 ", backendData);
        console.log("filteredData 1 ", filteredData);
        console.log("originalData 1 ", originalData);

        for (let i = 1; i <= Math.ceil(filteredData.length / itemsPerPage); i++) {
            pageNumbers.push(i);
        }
        console.log("pageNumbers.length ", pageNumbers.length);

        // Calculate the start and end page numbers to display
        let startPage, endPage;
        if (pageNumbers.length <= 15) {
            // Less than or equal to 15 pages, display all
            startPage = 1;
            endPage = pageNumbers.length;
        } else {
            // More than 15 pages, display some pages with ellipsis
            if (currentPage <= 8) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 7 >= pageNumbers.length) {
                startPage = pageNumbers.length - 14;
                endPage = pageNumbers.length;
            } else {
                startPage = currentPage - 7;
                endPage = currentPage + 7;
            }
        }

        return (
            <ul className="pagination">
                <li>
                    <button onClick={prevPage} disabled={currentPage === 1} className='btn btn-dark mt-4 paginationBtn btnPrev'>‹</button>
                </li>
                {startPage !== 1 && (
                    <li>
                        <button onClick={() => setPage(1)} className={`btn btn-dark mt-4 paginationBtnNumb`}>
                            1
                        </button>
                    </li>
                )}
                {startPage > 2 && (
                    <li>
                        <button className={`btn btn-dark mt-4 paginationBtnNumb`}>
                            ...
                        </button>
                    </li>
                )}
                {pageNumbers.slice(startPage - 1, endPage).map((number) => (
                    <li key={number}>
                        <button onClick={() => setPage(number)} className={`btn btn-dark mt-4 paginationBtnNumb ${currentPage === number ? 'currentPage' : ''}`}>
                            {number}
                        </button>
                    </li>
                ))}
                {endPage < pageNumbers.length - 1 && (
                    <li>
                        <button className={`btn btn-dark mt-4 paginationBtnNumb`}>
                            ...
                        </button>
                    </li>
                )}
                {endPage !== pageNumbers.length && (
                    <li>
                        <button onClick={() => setPage(pageNumbers.length)} className={`btn btn-dark mt-4 paginationBtnNumb`}>
                            {pageNumbers.length}
                        </button>
                    </li>
                )}
                <li>
                    <button onClick={nextPage} disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)} className='btn btn-dark mt-4 paginationBtn'>›</button>
                </li>
            </ul>
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
                            <div className="col-md-12 featured-top">
                                <div className="row no-gutters">
                                    <div className="col-md-12 d-flex align-items-center bg-primary" style={{ 'marginTop': '40px', 'maxHeight': '110px' }}>

                                        <div className="request-form bg-primary fadeInUp text-left w-100 cardetailsForm">
                                            <h2>My Booking History</h2>
                                            <input type="text" value={searchQuery} onChange={handleSearchInputChange} placeholder="Search by Order ID" className='searchOrderDetails' />

                                            <div className="d-flex">
                                                <button className="btn py-2 ml-2 forNoSQLdialogBtn postgresqlideabtn" onClick={() => handleOpenPostgreModal()} ><img src='/resources/images/idea-bulb.svg' /></button>
                                            </div>

                                        </div>

                                    </div>
                                    <div className="col-md-12 d-flex align-items-center carBigImage">

                                        <div className="servicesBookings-wrap1 rounded-right w-100 text-left">

                                            <Container>
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
                                                            {/* <tbody>
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
                                                            </tbody> */}
                                                            <tbody>
                                                                {currentItems.map((orderD, index) => (
                                                                    <React.Fragment key={index}>
                                                                        <tr>
                                                                            <td>{orderD.orderid}</td>
                                                                            <td>{orderD.brand + ' ' + orderD.name}</td>
                                                                            <td>{orderD.duration} {orderD.duration === 1 ? 'Day' : 'Days'}</td>
                                                                            <td>{formatDate(orderD.order_when)}</td>
                                                                            <td>
                                                                                {isBookingDateValid(orderD.order_when) && (
                                                                                    <button className="btn btn-primary py-2 mr-2" onClick={() => handleToggleRow(index, orderD.carid)}>
                                                                                        <FontAwesomeIcon icon="fa-solid fa-car-on" />  Car Health</button>

                                                                                )}




                                                                                {/* <button className="btn btn-primary py-2 mr-2" onClick={() => handleToggleRow(index, orderD.carid)}>
                                                                                            <FontAwesomeIcon icon="fa-solid fa-car-on" />  Car Health</button>
                                                                                   <button className="btn py-2 ml-2 forNoSQLdialogBtn" onClick={() => handleOpenModal() } ><FontAwesomeIcon icon="fa-solid fa-code" /> NoSQL</button> */}
                                                                            </td>
                                                                        </tr>

                                                                        {expandedRow === index && (

                                                                            <tr className='expanded'>

                                                                                <td colSpan="5">

                                                                                    <Container className='carHealthBody'>
                                                                                        <Row>
                                                                                            <Col style={{ 'height': '150px' }} className='col-sm-4'>
                                                                                                <div className="img rounded d-flex align-items-end carlist" style={{ 'backgroundImage': `url(/resources/images/cars/${carDetails[0].carid}.png)`, "width": "200px", "height": "100px", "margin": "auto" }}> </div>
                                                                                                <h5 className='carModel-Popup w-100'>{carDetails[0].model + " " + carDetails[0].name}</h5>
                                                                                            </Col>
                                                                                            <Col style={{ 'backgroundColor': '#1089ff' }} className='p-2'>
                                                                                                <Container>
                                                                                                    <Row>
                                                                                                        <Col className='col-3'><label className="labelWhiteText">Engine CC</label>
                                                                                                            <label className='valueWhiteTxt setenceCase'>{carDetails[0].enginepower}</label></Col>
                                                                                                        <Col className='col-3'><label className="labelWhiteText">Fuel Type</label>
                                                                                                            <label className='valueWhiteTxt setenceCase'>{carDetails[0].fueltype}</label></Col>
                                                                                                        <Col className='col-3'><label className="labelWhiteText">Mileage</label>
                                                                                                            <label className='valueWhiteTxt setenceCase'>{carDetails[0].mileage}</label></Col>
                                                                                                        <Col className='col-3'></Col>
                                                                                                        <Col className='col-3'><label className="labelWhiteText">Engine Status</label>
                                                                                                            <label className='valueWhiteTxt setenceCase'>{carDetails[0].enginestatus}</label></Col>
                                                                                                        <Col className='col-3'><label className="labelWhiteText">Transmission</label>
                                                                                                            <label className='valueWhiteTxt setenceCase'>{carDetails[0].transmissiontype}</label></Col>
                                                                                                        <Col className='col-3'><label className="labelWhiteText">Fuel Level</label>
                                                                                                            <label className='valueWhiteTxt setenceCase'>{carDetails[0].fuelLevel}</label></Col>

                                                                                                        <Col className='col-3'><label className="labelWhiteText">Last Service Date</label>
                                                                                                            <label className='valueWhiteTxt setenceCase'>{formatDateNew(carDetails[0].lastservicedate)}</label></Col>

                                                                                                    </Row>
                                                                                                    <button className="btn py-2 ml-2 forNoSQLIdeadialogBtn" onClick={() => handleOpenNoSQLModal()} ><img src='/resources/images/idea-bulb.svg' /></button>
                                                                                                </Container>

                                                                                            </Col>
                                                                                        </Row>
                                                                                    </Container>

                                                                                </td>
                                                                            </tr>
                                                                        )}
                                                                    </React.Fragment>
                                                                ))}
                                                            </tbody>
                                                        </Table>
                                                        {/* Render pagination */}
                                                        {renderPagination()}
                                                        {/* Your existing JSX */}
                                                    </Col>
                                                </Row>
                                                {/* <Row>
                                                    <Col className='text-center'>
                                                        <button className="btn btn-dark mt-4" onClick={() => nav("/")}> Home </button></Col>
                                                </Row> */}
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

            <Modal show={showNoSQLModal} onHide={handleCloseNoSQLModal} className='imgModal' centered>
                <Modal.Header closeButton>
                    <Modal.Title>NoSQL</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container className='carHealthBody'>
                        <Row>
                            <Col className='col-12'>
                                <p><img src='/resources/images/popup-img/NoSql_1.svg' /></p>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseNoSQLModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showPostgreModal} onHide={handleClosePostgreModal} className='vehDetailsPop' centered>
                <Modal.Header closeButton>
                    <Modal.Title>PostgreSQL</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container className='carHealthBody'>
                        <Row>
                            <Col className='col-12'>
                                <p><img src='/resources/images/popup-img/PostgreSQL_2.svg' /></p>
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

        </>
    )
}

export default MyBookings
