// CarList.js
import React from 'react';
import './carlist.css';

const CarList = ({ cars }) => {
  return (
    <div >
      <section class="ftco-section ftco-no-pt bg-light">
        <div class="container">
      <h2>Car List</h2>
      <div className="row">
        {cars.map((car, index) => (
          <div key={index} className="col-md-4">
            <div className="card  w-100 mb-4">
              
              <div class="img rounded d-flex align-items-end"  style={{'backgroundImage': `url(/resources/images/cars/${car.car_img_src})`, "height": "150px", "width": "auto"}}>
           

		    					</div>
              <div className="card-body">
                <div className='car-wrap'>
              <div class="text">
		    						<h2 class="mb-0 text-start"><a href="#">{car.car_name}</a></h2>
		    						<div class="d-flex mb-3">
			    						<span class="cat">{car.fuel_type}</span>
			    						<p class="price ml-auto">$ {car.cost_per_hour} <span>/ hour</span></p>
                      
		    						</div>
                    <div className='d-flex justify-content-between'>
                      <span className="card-text"><span class="icon-car"></span> {car.car_type}</span>
                <span className="card-text"><span class="icon-location-arrow"></span> {car.location}</span>
                </div>
		    						<p class="d-flex mt-2 d-block"><a href="#" class="btn btn-primary py-2 mr-1">Book now</a> <a href="#" class="btn btn-secondary py-2 ml-1">Details</a></p>
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
