const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-extensions',
      '--disable-component-extensions-with-background-pages',
      '--disable-default-apps',
      '--no-default-browser-check',
      '--bwsi',
    ]
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  try {
    await page.goto('http://bobs-thedev.tech/hrms/login', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(r => setTimeout(r, 4000));
    await page.screenshot({ path: '/var/www/portfolio/html/images/hrms-live.png' });
    console.log('HRMS screenshot saved!');
  } catch (e) {
    console.error('Error:', e.message);
  }
  await browser.close();
})();
