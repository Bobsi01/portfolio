const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('file:///C:/Workspace/portfolio/index.html', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  
  // 1. Verify CML Card Thumbnail
  const cards = await page.$$('.project-card');
  if (cards[3]) {
    await cards[3].screenshot({ path: 'images/verify-cml-card.png' });
    console.log('Saved CML Card thumbnail');
  }

  // 2. Open CML modal and verify first image
  if (cards[3]) await cards[3].click();
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'images/verify-cml-modal-1.png' });
  console.log('Saved CML Modal State 1');

  // 3. Wait for interval to cycle image (3500ms + fade)
  await new Promise(r => setTimeout(r, 3800));
  await page.screenshot({ path: 'images/verify-cml-modal-2.png' });
  console.log('Saved CML Modal State 2');

  // 4. Verify Ourchive Modal
  await page.evaluate(() => window.closeProjectModal());
  await new Promise(r => setTimeout(r, 800));
  if (cards[2]) await cards[2].click();
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'images/verify-ourchive-modal.png' });
  console.log('Saved Ourchive Modal');

  await browser.close();
})();
