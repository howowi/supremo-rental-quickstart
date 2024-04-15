import { browser } from 'k6/experimental/browser';
import { check } from 'k6';
// import http from 'k6/http';

export const options = {
  scenarios: {
    frontend: {
      executor: 'shared-iterations',
      exec: 'browserTest',
      vus: 5,
      iterations: 5,
      options: {
        browser: {
          type: 'chromium',
        }
      }
    }
  },
  insecureSkipTLSVerify: true
};

export async function browserTest() {
  const page = browser.newPage();

  try {
    await page.goto(__ENV.URL);
    // await page.goto('http://supremorentals.oracledemo.online/');
    // page.screenshot({ path: 'screenshots/homepage.png' });

    const booknow = page.locator('.col-md-4:nth-child(1) .btn');
    await Promise.all([page.waitForNavigation(), booknow.click()]);
    // page.screenshot({ path: 'screenshots/cardetails.png' });
    
    const proceed_book = page.locator('.btn-secondary');
    await Promise.all([page.waitForNavigation(), proceed_book.click()]);
    // page.screenshot({ path: 'screenshots/checkout.png' });

    const confirm_book = page.locator('.btn-secondary');
    await Promise.all([page.waitForNavigation(), confirm_book.click()]);
    // // page.screenshot({ path: 'screenshots/confirm.png' });

    check(page, {
      'Booking is confirmed': page.locator('.badge').textContent() === 'Booking Confirmed',
    });

  } finally {
    page.close();
  }
}