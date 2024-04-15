import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/animate.css';
import '../css/owl.theme.default.min.css';
import '../css/magnific-popup.css';
import '../css/aos.css';
import '../css/ionicons.min.css';
import '../css/bootstrap-datepicker.css';
import '../css/jquery.timepicker.css';
import '../css/flaticon.css';
import '../css/icomoon.css';
import '../css/style.css';

import '@popperjs/core';

import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap JS
import 'owl.carousel/dist/assets/owl.carousel.css'; // Import Owl Carousel CSS
// import 'owl.carousel';
import 'magnific-popup';
import 'aos/dist/aos.css'; // Import AOS CSS
import 'aos';
// import 'animate-number-component';
import 'bootstrap-datepicker';
// import 'jquery-timepicker';
import 'scrollax';

import React, { useState, useEffect } from 'react';
import TopNavBarN from '../TopNavBarN';
import FooterSection from '../Footer';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const history = useNavigate();
  const [username, setUsername] = useState('JohnC');
  const [password, setPassword] = useState('123456');
  // localStorage.setItem('userid', username);
  

  // const handleLogin = async (e) => {
  //   e.preventDefault();
    // console.log("handleLogin function called");
    // console.log("name ", username);
   
    // Call your authentication API with username and password


    // var myHeaders = new Headers();
    // myHeaders.append("Content-Type", "application/json",);
    // let raw = JSON.stringify({ userid: username, password });

    // const response = await fetch("http://api-supremo.oracledemo.online/user-service-redis/authn", {
    //   method: 'POST',
    //   mode: 'cors', // this cannot be 'no-cors'
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: raw,
    //   redirect: 'follow'
    // });

    // const data = await response.json();
    // const data = '{ "code": 0, "msg": "OK", "userid": "JohnC" }';
    // console.log(" data is >>", data);

    // Assuming your API returns a token on successful login
    // if (data) {
    //   console.log("login details response ", data);
    //   if (data.code === 0 && data.msg === "OK") {
        // localStorage.setItem('userid', username);
        // history("/", { state: { userid: username } });
    //   } else {
    //     console.log("navigation fails ");
    //     // we need to show some message in UI
    //   }
    // } else {
    //   // Handle login failure
    //   console.log(" Login error details response ", data);
    //   // we need to show some message in UI
    // }
  // };

  useEffect(() => {
    const autoLogin = async () => {
      // Call your authentication API with the stored username and password
      // Replace the following lines with your authentication logic
      // For now, I'm just setting the user ID in localStorage and navigating to the home page
      localStorage.setItem('userid', username);
      history("/", { state: { userid: username } });
    };

    autoLogin(); // Trigger auto-login
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  const handleLogin = async (e) => {
    e.preventDefault();
    // Your login logic goes here
    // ...

    // Example: Set user ID in localStorage and navigate to the home page
    localStorage.setItem('userid', username);
    history("/", { state: { userid: username } });
  };

  return (
    <div>


      <div>
        <TopNavBarN />
        <div className="container">
          <div className="row no-gutters">
            <div className="col-md-12">
              <div className="backBtn-wrap rounded-right w-100 text-left">


              </div></div>
          </div>
        </div>
        <section className="ftco-loginsection1 bg-light">

          <div className="container">
            <div className="row no-gutters">
              <div className="col-md-12	featured-top">
                <div className="row no-gutters">
                  <div className="col-md-4 d-flex align-items-center bg-primary">

                    <form action="#" className="request-form bg-primary fadeInUp text-left w-100 cardetailsForm">

                      <h2>Login</h2>
                      <div className="form-group">
                        <label className="labelWhiteTextLabel">UserId</label>
                        <input className='valueWLoginTxt'
                          type="text"
                          placeholder="Username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="labelWhiteTextLabel">Password</label>
                        <input className='valueWLoginTxt'
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <button onClick={handleLogin} className='btn btn-secondary py-2 ml-1'>Login</button>

                    </form>

                  </div>
                  <div className="col-md-8 d-flex align-items-center carBigImage" style={{ 'marginTop': '-40px' }}>
                    <div className="services-wrap rounded-right w-100 text-left">

                      <div className="row d-flex mb-4">
                        <div className="img rounded d-flex align-items-end detailPgCarImg" style={{ 'backgroundImage': `url(/resources/images/login_head.png)` }}>
                          <div className="proceed-wrap rounded-right w-100 text-center">


                          </div>
                        </div>
                      </div>
                    </div>

                  </div> {/* */}
                </div>
              </div>
            </div>
          </div>

        </section>


        <FooterSection />
      </div>

    </div>
  );
};

export default Login;