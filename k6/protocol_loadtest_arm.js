// import { browser } from 'k6/experimental/browser';
// import { check } from 'k6';
import http from 'k6/http';
import { sleep, group } from 'k6'

export const options = {
  scenarios: {
    supremoapp: {
      executor: 'ramping-arrival-rate',
      preAllocatedVUs: 100,
      stages: [
        { target: 2000, duration: '15m' },
      ],
      exec: 'browserTest',
    }
  },
  insecureSkipTLSVerify: true
};

export async function browserTest() {
  let response

  group('frontend - http://supremorentalsarm.oracledemo.online/', function () {
    response = http.get('http://supremorentalsarm.oracledemo.online/', {
      headers: {
        'upgrade-insecure-requests': '1',
      },
    })
    response = http.get('http://supremorentalsarm.oracledemo.online/css/open-iconic-bootstrap.min.css')
    response = http.get('http://supremorentalsarm.oracledemo.online/resources/images/cars/t001.png')
    response = http.get('http://supremorentalsarm.oracledemo.online/resources/images/cars/t002.png')
    response = http.get('http://supremorentalsarm.oracledemo.online/resources/images/cars/t003.png')
    response = http.get('http://supremorentalsarm.oracledemo.online/resources/images/cars/t004.png')
    response = http.get('http://supremorentalsarm.oracledemo.online/resources/images/cars/t005.png')
    response = http.get('http://supremorentalsarm.oracledemo.online/resources/images/cars/t006.png')
    response = http.get('http://supremorentalsarm.oracledemo.online/resources/images/cars/t007.png')
    response = http.get('http://supremorentalsarm.oracledemo.online/resources/images/cars/t008.png')
    response = http.get('http://supremorentalsarm.oracledemo.online/resources/images/cars/t009.png')
    response = http.get('http://supremorentalsarm.oracledemo.online/resources/images/cars/t010.png')
  })

  group('page_1 backend - http://supremorentalsarm.oracledemo.online/', function () {
    response = http.get('http://api-supremo.oracledemo.online/order-service/user-orders?userid=JohnC')
    response = http.get('http://api-supremo.oracledemo.online/user-service-redis/users/JohnC')
    response = http.get('http://api-supremo.oracledemo.online/car-service-redis/cars')
  })

  group('page_2 backend - http://supremorentalsarm.oracledemo.online/carcheckout/t001', function () {
    response = http.get('http://api-supremo.oracledemo.online/car-service-redis/cars/t001')
    response = http.get('http://api-supremo.oracledemo.online/order-service/user-orders?userid=JohnC')
    // response = http.post(
    //   'http://api-supremo.oracledemo.online/order-service/create-order',
    //   '{"userid":"JohnC","carid":"t001","brand":"Toyoto","name":"Corolla","from_date":"2024-03-04","end_date":"2024-03-05","duration":1,"ordered":"TRUE"}',
    //   {
    //     headers: {
    //       'content-type': 'application/json',
    //     },
    //   }
    // )
    // response = http.options('http://api-supremo.oracledemo.online/order-service/create-order', null, {
    //   headers: {
    //     accept: '*/*',
    //     'access-control-request-headers': 'content-type',
    //     'access-control-request-method': 'POST',
    //     origin: 'http://supremorentalsarm.oracledemo.online',
    //     'sec-fetch-mode': 'cors',
    //   },
    // })
  })
  group('page_3 backend - http://supremorentalsarm.oracledemo.online/page3', function () {
    response = http.get('http://api-supremo.oracledemo.online/order-service/user-orders?userid=JohnC')
    response = http.get('http://api-supremo.oracledemo.online/user-service-redis/users/JohnC')
    response = http.get('http://api-supremo.oracledemo.online/car-service-redis/cars')
  })

  group('page_4 backend - http://supremorentalsarm.oracledemo.online/page4', function () {
    response = http.get('http://api-supremo.oracledemo.online/order-service/user-orders?userid=JohnC')
    response = http.get('http://api-supremo.oracledemo.online/user-service-redis/users/JohnC')
    response = http.get('http://api-supremo.oracledemo.online/car-service-redis/cars')
  })
}