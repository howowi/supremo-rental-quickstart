import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { IconButton } from "rsuite";
// import { Admin, Menu, Reload, Resize, Search } from '@rsuite/icons'; 
import OffRoundIcon from '@rsuite/icons/OffRound';

const TopNavBarN = ({ onLogout, userJsonVal, bookingCount, clearFilters }) => {
  const history = useNavigate();
  const [userID, setUserID] = useState('')
  const getUserId = localStorage.getItem('userid'); //userJsonVal.userid;
  const [token, setToken] = useState(localStorage.getItem('userId'));
  const [backendData, setBackendData] = useState([]);


  const handleLogout = () => {
    // Reset userid and token
    localStorage.removeItem('userid');
    setToken(null);

    // Navigate to the login page
    history('/login');
  };

  useEffect((backendData) => {
    if (userJsonVal && userJsonVal.userid) {
      const userId = userJsonVal.userid;
      setUserID(userId);
      console.log('Fetching data for user ID:', userJsonVal.userid);

      fetch(`http://api-supremo.oracledemo.online/order-service/user-orders?userid=${userId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Data from server:", data.length);
          setBackendData(data.length);
        })
        .catch((err) => {
          console.log('Error fetching data:', err);
        });
    }
  }, [userJsonVal]);

  useEffect(() => {
    if (userJsonVal && userJsonVal.userid) {
      const userId = userJsonVal.userid;
      setUserID(userId);
      console.log('Fetching data for user ID: > ', userId);

      fetch(`http://api-supremo.oracledemo.online/order-service/user-orders?userid=${userId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Data from server:>> ", data);
          setBackendData(data);
        })
        .catch((err) => {
          console.log('Error fetching data:', err);
        });
    }
  }, [userJsonVal]);


  // Redirect to root if getUserId is null
  useEffect(() => {
    if (userID === null) {
      history('/login');
    }
  }, [userID, history]);

  console.log("before login userid is ", userID)

  if (!getUserId) {
    // If getUserId is null, user is not logged in
    return (



      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <h2 className="ftco-heading-2">
            <LinkContainer to="/" className="logo">
              <Navbar.Brand>Supremo<span> Rental</span></Navbar.Brand>
            </LinkContainer>
          </h2>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <LinkContainer to="/">
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/AboutUs">
                <Nav.Link>About Us</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/AskMe">
                <Nav.Link>Ask Me</Nav.Link>
              </LinkContainer>
            </Nav>
            <Nav>
              {/* <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

    )
  } else {
    return (
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <h2 className="ftco-heading-2">
            <LinkContainer to="/" className="logo" onClick={clearFilters}>
              <Navbar.Brand>Supremo<span> Rental</span></Navbar.Brand>
            </LinkContainer>
          </h2>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <LinkContainer to="/" onClick={clearFilters}>
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/AboutUs">
                <Nav.Link>About Us</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/AskMe">
                <Nav.Link>Ask Me</Nav.Link>
              </LinkContainer>
            </Nav>

            <Nav>
              <LinkContainer to="/mybookings">
                <Nav.Link><span className='noOfOrder'>{bookingCount ? bookingCount : 0}</span> My Bookings</Nav.Link>
              </LinkContainer>
              <span className='pipeSym nav-link'>|</span>
              {/* <LinkContainer to="/profile">
                  <Nav.Link bookingCountDet={bookingCount} userID={userID}>Profile</Nav.Link>
                </LinkContainer> */}
              <LinkContainer to="/profile">
                <Nav.Link>Profile</Nav.Link>
              </LinkContainer>

              <span className='pipeSym nav-link'>|</span>
              <span className=' nav-link pt-2'>Welcome, <span style={{ 'color': '#fff' }}>{getUserId ? getUserId : 'Guest'}</span></span>

              <IconButton icon={<OffRoundIcon />} appearance="primary" className='topNavIconSignOut' onClick={handleLogout} />
              {/* <LinkContainer></LinkContainer> */}
            </Nav>
          </Navbar.Collapse>
          {/* <div>
            <div className="container-floatingbtn">
              <input type="checkbox" id="toggle" />
              <label className="button" for="toggle"><svg width="24" height="15" viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M23.4 2H0.6C0.2688 2 0 1.552 0 1C0 0.448 0.2688 0 0.6 0H23.4C23.7312 0 24 0.448 24 1C24 1.552 23.7312 2 23.4 2ZM23.4 15H0.6C0.2688 15 0 14.552 0 14C0 13.448 0.2688 13 0.6 13H23.4C23.7312 13 24 13.448 24 14C24 14.552 23.7312 15 23.4 15ZM0.6 8.5H23.4C23.7312 8.5 24 8.052 24 7.5C24 6.948 23.7312 6.5 23.4 6.5H0.6C0.2688 6.5 0 6.948 0 7.5C0 8.052 0.2688 8.5 0.6 8.5Z" fill="white" />
              </svg>
              </label>
              <nav className="nav">
                <ul>
                  <a href="http://oracle.com" target="_blank">Oracle</a>
                  <a href="http://oracle.com" target="_blank">PostgreSQL</a>
                  <a href="http://oracle.com" target="_blank">NoSQL</a>
                  <a href="http://oracle.com" target="_blank">FAQ</a>
                </ul>
              </nav>
            </div>
          </div> */}
        </Container>
      </Navbar>

    );
  }
};

export default TopNavBarN;
