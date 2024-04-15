import React, { useState, useEffect, useRef  } from 'react';
import { Button, Form } from 'react-bootstrap'; // Make sure to import Form from react-bootstrap
import { Link, useParams, useNavigate, Route } from 'react-router-dom';
import './carlist.css';
import Login from './pages/login';




const CarList = ({ backendData}) => {
  const filterRef = useRef(null);

  const getUserId = localStorage.getItem('userid');
  const [token, setToken] = useState(localStorage.getItem('userid'));
  const [userDataN, setUserData] = useState([]);
  const [showPopular, setShowPopular] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    brand: [],
    vehicletype: [],
    fueltype: [],
    locations: [],
  });


  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        // Clicked outside of the filter popup
        setShowFilter(false);
      }
    };

    // Add event listener when the filter popup is open
    if (showFilter) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      // Remove event listener when the filter popup is closed
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showFilter]);



  const clearFilters = () => {
    setShowPopular(false);
    setShowFilter(false);
    setFilterOptions({
      brand: [],
      vehicletype: [],
      fueltype: [],
      locations: [],
    });
  };

  const handlePopularClick = () => {
    setShowPopular(!showPopular);
  };

  const handleFilterClick = () => {
    setShowFilter(!showFilter);
  };

  const handleFilterChange = (filterType, value) => {
    setFilterOptions((prevFilters) => ({
      ...prevFilters,
      [filterType]: prevFilters[filterType].includes(value)
        ? prevFilters[filterType].filter((item) => item !== value)
        : [...prevFilters[filterType], value],
    }));
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

  if (getUserId === null) {
    // If getUserId is null, user is not logged in
    return (
      <>
        <Login onLogin={handleLogin} />
      </>
    )}

  
  // Get distinct values for each filter option
  const getDistinctValues = (key) => {
    const uniqueValues = new Set();
    backendData.forEach((car) => {
      const values = car[key].split(',').map((item) => item.trim());
      values.forEach((value) => uniqueValues.add(value));
    });
    return Array.from(uniqueValues);
  };

  const distinctBrands = getDistinctValues('brand');
  const distinctVehicleTypes = getDistinctValues('vehicletype');
  const distinctFuelTypes = getDistinctValues('fueltype');
  const distinctLocations = getDistinctValues('locations');

  const filteredCars = backendData.filter((car) => {
    const filterBrand =
      filterOptions.brand.length === 0 || filterOptions.brand.includes(car.brand);
    const filterVehicleType =
      filterOptions.vehicletype.length === 0 ||
      filterOptions.vehicletype.includes(car.vehicletype);
    const filterFuelType =
      filterOptions.fueltype.length === 0 || filterOptions.fueltype.includes(car.fueltype);
    const filterLocations =
      filterOptions.locations.length === 0 ||
      filterOptions.locations.some((location) =>
        car.locations.split(',').map((item) => item.trim()).includes(location)
      );

    const popularCondition = !showPopular || car.popular;

    return popularCondition && filterBrand && filterVehicleType && filterFuelType && filterLocations;
  });



  return (
      <>
    <div className='carListSection'>
      <section className="ftco-section ftco-no-pt bg-light">
        <div className="container">
          <h2>Car List</h2>
          <div className="row">
            <div className='col-md-12 d-flex align-items-start'>
              <Button className="col-md-2 btn btn-datk" onClick={handleFilterClick}>Show Filter</Button>
              <Button className="col-md-2 btn btn-dark ml-2" onClick={handlePopularClick}>Popular</Button>
            </div>
          </div>
          <div ref={filterRef} className={ showFilter ? 'row showWindowFilter' : 'd-none'}>
            <div className="col-md-12">
              <Form>
                <Form.Group>
                  <Form.Label>Filter Options:</Form.Label>
                  <h5>Brand </h5>
                  {distinctBrands.map((brand) => (
                    <Form.Check key={brand} type="checkbox" label={brand} onChange={() => handleFilterChange('brand', brand)} />
                  ))}
                  <h5>Vehicle Type</h5>
                  {distinctVehicleTypes.map((vehicletype) => (
                    <Form.Check key={vehicletype} type="checkbox" label={vehicletype} onChange={() => handleFilterChange('vehicletype', vehicletype)} />
                  ))}
                  <h5>Fuel Type </h5>
                  {distinctFuelTypes.map((fueltype) => (
                    <Form.Check key={fueltype} type="checkbox" label={fueltype} onChange={() => handleFilterChange('fueltype', fueltype)} />
                  ))}
                  <h5>Locations </h5>
                  {distinctLocations.map((location) => (
                    <Form.Check key={location} type="checkbox" label={location} onChange={() => handleFilterChange('locations', location)} />
                  ))}
                </Form.Group>
              </Form>
            </div>
          </div>
          <div className="row mt-3">
            {filteredCars.map((car, index) => (
              <div key={index} className="col-md-4">
                {car && car.popular && (
                  <div className="ribbon down" style={{ "--color": "#fd2d2e" }}>
                    <div className="content">
                      <svg width="24px" height="24px" aria-hidden="true" focusable="false" data-prefix="far" data-icon="star" className="svg-inline--fa fa-star fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                        <path fill="currentColor" d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z"></path>
                      </svg>
                    </div>
                  </div>
                )}
                <div className="card shadow-sm w-100 mb-4">
                  <div className="img rounded d-flex align-items-end carlist" style={{ 'backgroundImage': `url(/resources/images/cars/${car.carid}.png)`, "height": "150px", "width": "auto" }}>
                  </div>
                  <div className="card-body custompadding">
                    <div className='car-wrap'>
                      <div className="text">
                        <h2 className="mb-0 text-start"><a href="#">{car.brand} {car.name}</a></h2>
                        <div className="d-flex mb-3">
                          <span className="cat">{car.fueltype}</span>
                          <p className="price ml-auto">$ {car.price} <span>/ hour</span></p>
                        </div>
                        <div className='d-flex justify-content-between mn-ht-details'>
                          <span className="card-text"><span className="icon-car"></span> {car.vehicletype}</span>
                          <span className="card-text"><span className="icon-location-arrow"></span> {car.locations}</span>
                        </div>

                        <p className="d-flex mt-2 d-block justify-content-center"><Link to={`/cardetails/${car.carid}`} className="btn btn-primary py-2 ml-1">Book Now</Link>
                        {/* <Link to={`/carcheckout/${car.carid}`} className="btn btn-primary py-2 ml-1">Book Now</Link>  */}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

const styles = {
  card: {
    margin: '10px',
    borderRadius: '5px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
};

export default CarList;
