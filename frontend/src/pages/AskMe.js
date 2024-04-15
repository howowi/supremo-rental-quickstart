// import { Button, FormControl, FormGroup } from "react-bootstrap";
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, FormControl, FormGroup, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import TopNavBarN from '../TopNavBarN';
import FooterSection from '../Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function AskMe({ onLogout, userJsonVal, bookingCount }) {
    const [userDataN, setUserData] = useState([userJsonVal]);
    const [backendData, setBackendData] = useState([]);
    const [carsCountData, setcarsCountData] = useState([]);
    const nav = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [showIdeaModal, setShowIdeaModal] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('userid'));
    const getUserId = localStorage.getItem('userid');


    useEffect(() => {
        if (getUserId) {
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
        }
    }, [getUserId]);

    const handleLogout = () => {
        // Reset userid and token
        localStorage.removeItem('userid');
        setToken(null);

        // Navigate to the root page
        nav('/');
    };

    const [searchValue, setSearchValue] = useState('');
    const onChange = (event) => {
        setSearchValue(event.target.value);
        //setSearchValue(searchText);
    }

    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleOpenSearch = () => {
        setLoading(true);

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Basic b3BlbnNlYXJjaDpPcmFjbGUjMTIz");

        var raw = JSON.stringify({
            "query": {
                "multi_match": {
                    "query": searchValue,
                    "fields": [
                        "question",
                        "answer",
                        "url"
                    ]
                }
            }
        });

        var requestOptions = {
            method: 'POST', // Change the method to POST
            headers: myHeaders,
            body: raw, // Include the request body for POST
            redirect: 'follow'
        };

        fetch("http://api-supremo.oracledemo.online/askme-search", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result);
                setSearchResults(result);
            })
            .catch(error => {
                console.log('Error fetching search results:', error);
                // Display an error message to the user
            })
            .finally(() => {
                setLoading(false);
            });
    };


    const handleOpenModal = () => {
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleOpenIdeaModal = () => { setShowIdeaModal(true); };
    const handleCloseIdeaModal = () => { setShowIdeaModal(false); };


    return (
        <>
           

            <div>
                <TopNavBarN onLogout={handleLogout} userJsonVal={userDataN} bookingCount={carsCountData.length} />
                <div className="container">
                    <div className="row no-gutters">
                        <div className="col-md-12">
                            <div className="backBtn-wrap rounded-right w-100 text-left">
                                {/* <AskMeSearchSection /> */}
                                <div className="col-md-12 d-flex align-items-center bg-primary">

                                    <form action="#" className="askme-request-form bg-primary fadeInUp text-left d-flex w-100">
                                        <div className="d-flex align-bottom w-100">
                                            <div className="form-group mr-2 d-flex col-md-12 searchTxtOuter">
                                                <div className="col-md-2"><span className="askMeTxt"><FontAwesomeIcon icon="fa-solid fa-handshake-angle" /> Ask Me</span>
                                                    <span className=''> </span>
                                                </div>
                                                <FormGroup className="col-md-7">
                                                    <FormControl type="text" placeholder="Search - Opensearch" className="searchTxt" value={searchValue} onChange={onChange} />
                                                </FormGroup>{' '}
                                                <Button className="col-md-2 btn btn-secondary" onClick={() => handleOpenSearch(searchValue)}>Submit</Button>
                                                <div className='col-md-1'></div>
                                                
                                            </div>
                                               
                                        </div>
                                    </form>
                                    <button className="btn py-2 mr-2 foridea_bulb_Btn" onClick={() => handleOpenIdeaModal()}><img src='/resources/images/idea-bulb.svg'/></button>
                                             
                                </div>
                                {/* <button className="btn py-2 mr-2 forMoreInfodialogBtn" onClick={() => handleOpenModal()}> <span className='opensearchico'><svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M61.7374 23.5C60.4878 23.5 59.4748 24.513 59.4748 25.7626C59.4748 44.3813 44.3813 59.4748 25.7626 59.4748C24.513 59.4748 23.5 60.4878 23.5 61.7374C23.5 62.987 24.513 64 25.7626 64C46.8805 64 64 46.8805 64 25.7626C64 24.513 62.987 23.5 61.7374 23.5Z" fill="#005EB8" />
                                    <path d="M48.0814 38C50.2572 34.4505 52.3615 29.7178 51.9475 23.0921C51.0899 9.36725 38.6589 -1.04463 26.9206 0.0837327C22.3253 0.525465 17.6068 4.2712 18.026 10.9805C18.2082 13.8961 19.6352 15.6169 21.9544 16.9399C24.1618 18.1992 26.9978 18.9969 30.2128 19.9011C34.0962 20.9934 38.6009 22.2203 42.063 24.7717C46.2125 27.8295 49.0491 31.3743 48.0814 38Z" fill="#003B5C" />
                                    <path d="M3.91861 14C1.74276 17.5495 -0.361506 22.2822 0.0524931 28.9079C0.910072 42.6327 13.3411 53.0446 25.0794 51.9163C29.6747 51.4745 34.3932 47.7288 33.974 41.0195C33.7918 38.1039 32.3647 36.3831 30.0456 35.0601C27.8382 33.8008 25.0022 33.0031 21.7872 32.0989C17.9038 31.0066 13.3991 29.7797 9.93694 27.2283C5.78746 24.1704 2.95092 20.6257 3.91861 14Z" fill="#005EB8" />
                                </svg>
                                </span> Open Search</button> */}


                               
                            </div>
                        </div>
                    </div>
                </div>
                <section className="ftco-section-askme bg-light">

                    <div className="container">
                        <div className="container">
                            <div className="row no-gutters">
                                <div className="col-md-12 featured-top">
                                    <div className="row no-gutters">
                                        <div className="col-md-12 d-flex align-items-center carBigImage">
                                            <div className="services-wrap1 rounded-right w-100 text-left">
                                                <Container>
                                                    <Row>
                                                        <Col>
                                                        {loading && <p>Loading...</p>}
                                                            {/* Display search results */}
                                                            {searchResults.hits?.hits.map((result, index) => (
                                                                <div key={index} className="result-card">
                                                                    <h5>{result._source.question || result._source.Question}</h5>
                                                                    <p>{ result._source.answer || result._source.Answer}</p>
                                                                    <a href={result._source.url} target="_blank" rel="noopener noreferrer">
                                                                        {result._source.url}
                                                                    </a>
                                                                </div>
                                                            ))}
                                                        </Col>
                                                    </Row>
                                                    {/* <Row>
                                                        <Col className='text-center'>
                                                            <button className="btn btn-dark mt-4" onClick={() => nav("/")}> Home </button>
                                                        </Col>
                                                    </Row> */}
                                                </Container>
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

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title> - Car Health</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container className='carHealthBody'>
                        <Row>
                            <Col className='col-sm-12'>
                                <p><strong>Type</strong>:&nbsp;Search Engine</p>
                                <p><strong>Why?</strong>:&nbsp;</p>
                                <ul>
                                    <li>Insight engine to perform real-time search on text, documents like FAQs, billing queries, car manual</li>
                                    <li>Ability to ingest, visualize, and analyze log data</li>
                                </ul>
                                <p><strong>OCI Differentiator</strong>:&nbsp;Choose the exact number of cores/memory as per workload, automated high availability</p>
                                <p><strong>Outcome</strong>:&nbsp;Real-time text search, analysis of log data</p>
                                <p><em><strong>Find out more</strong></em>:&nbsp;<a href="https://www.oracle.com/cloud/search/">Link</a></p>


                            </Col>
                        </Row>
                    </Container>


                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showIdeaModal} onHide={handleCloseIdeaModal} className='askMeImgModal' centered>
                <Modal.Header closeButton>
                    <Modal.Title> Real Time Search</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container className='carHealthBody'>
                        <Row>
                            <Col className='col-12'>
                                <p><img src='/resources/images/popup-img/OpenSearch_1.svg'/></p>


                            </Col>
                        </Row>
                    </Container>


                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseIdeaModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>


        </>
    );
}

export default AskMe
