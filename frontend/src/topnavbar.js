// import Container from 'react-bootstrap/Container';
// import Nav from 'react-bootstrap/Nav';
// import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown';
// import logo from './logo.svg';

// import { Link } from 'react-router-dom';
// import AboutUs from './AboutUs';

function TopNavBar() {
  return (

    <nav className="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
	    <div className="container">
	      <a className="navbar-brand" href="/">SupremoCar<span> Rental</span></a>
	      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
	        <span className="oi oi-menu"></span> Menu
	      </button>

	      <div className="collapse navbar-collapse" id="ftco-nav">
	        <ul className="navbar-nav ml-auto">
	          <li className="nav-item active"><a href="/" className="nav-link">Home</a></li>
	          <li className="nav-item"><a href="/AboutUs" className="nav-link">About</a></li>
	          <li className="nav-item"><a href="services.html" className="nav-link">Services</a></li>
	          <li className="nav-item"><a href="pricing.html" className="nav-link">Pricing</a></li>
	          <li className="nav-item"><a href="car.html" className="nav-link">Cars</a></li>
	          <li className="nav-item"><a href="/faq" className="nav-link">FAQ</a></li>
	          <li className="nav-item"><a href="contact.html" className="nav-link">Contact</a></li>
	        </ul>
	      </div>
	    </div>
	  </nav>
   
  );
}

export default TopNavBar;