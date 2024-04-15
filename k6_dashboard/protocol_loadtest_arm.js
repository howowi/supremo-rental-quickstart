// import { browser } from 'k6/experimental/browser';
// import { check } from 'k6';
import http from 'k6/http';
import { sleep, group } from 'k6'

export const options = {
  scenarios: {
    supremoapp: {
      // executor: 'ramping-arrival-rate',
      // preAllocatedVUs: __ENV.VUS,
      // stages: [
      //   { target: __ENV.TARGET, duration: __ENV.DURATION },
      // ],
      executor: 'constant-vus',
      vus: __ENV.VUS,
      duration: __ENV.DURATION,
      exec: 'browserTest',
    }
  },
  insecureSkipTLSVerify: true
};

export async function browserTest() {
  let response

  group('page_1 backend - http://supremorentalsarm.oracledemo.online/', function () {
    response = http.get('http://api-supremo.oracledemo.online/order-service/user-orders?userid=JohnC')
  })
}