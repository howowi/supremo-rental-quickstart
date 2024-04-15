import React, { useState } from 'react';
import { Button, Form, Modal, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const FilterModal = ({ show, onHide, filterOptions, handleFilterChange, distinctBrands, distinctVehicleTypes, distinctFuelTypes, distinctLocations }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Filter Options:</Modal.Title>
      </Modal.Header>
      <Modal.Body>
             <Form>
                <Form.Group>
                  <Form.Label>Filter Options:</Form.Label>
                  <Form.Check type="checkbox" label="Brand" onChange={() => handleFilterChange('brand', 'yourBrand')}/>
                  {distinctBrands.map((brand) => (
                    <Form.Check key={brand} type="checkbox" label={brand} onChange={() => handleFilterChange('brand', brand)}/>
                  ))}
                  <Form.Check type="checkbox" label="Vehicle Type" onChange={() => handleFilterChange('vehicletype', 'yourVehicleType')}/>
                  {distinctVehicleTypes.map((vehicletype) => (
                    <Form.Check key={vehicletype} type="checkbox" label={vehicletype} onChange={() => handleFilterChange('vehicletype', vehicletype)} />
                  ))}
                  <Form.Check type="checkbox" label="Fuel Type"  onChange={() => handleFilterChange('fueltype', 'yourFuelType')}/>
                  {distinctFuelTypes.map((fueltype) => (
                    <Form.Check key={fueltype} type="checkbox" label={fueltype} onChange={() => handleFilterChange('fueltype', fueltype)} />
                  ))}
                  <Form.Check type="checkbox" label="Locations"  onChange={() => handleFilterChange('locations', 'yourLocation')}/>
                  {distinctLocations.map((location) => (
                    <Form.Check  key={location} type="checkbox" label={location}  onChange={() => handleFilterChange('locations', location)}/>
                  ))}
                </Form.Group>
              </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FilterModal;