const { chromium } = require('playwright');
const path = require('path');

async function capture() {
  console.log('🚀 Starting Playwright to capture high-definition live screenshots...');
  const browser = await chromium.launch({
    executablePath: '/home/iamfreak/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const context = await browser.newContext({
    viewport: { width: 1366, height: 860 },
    deviceScaleFactor: 2, // 2x Retina clarity
  });

  const page = await context.newPage();
  const baseUrl = 'http://localhost:54321';
  const outDir = path.join(__dirname, '../docs/screenshots');

  // 1. Home Feed / Public Notice Board
  console.log('📸 1. Capturing Home Public Notice Wall...');
  await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${outDir}/01-home-feed.png`, fullPage: false });

  // 2. Timeline Inspector Modal with Comments
  console.log('📸 2. Capturing Timeline Inspector Modal...');
  // Open the detail modal for ticket #101
  await page.evaluate(() => {
    const btn = document.querySelector('.open-detail-btn');
    if (btn) btn.click();
  });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${outDir}/02-timeline-inspector.png`, fullPage: false });

  // Close modal
  await page.evaluate(() => {
    const closeBtn = document.getElementById('closeDetailModalBtn');
    if (closeBtn) closeBtn.click();
  });
  await page.waitForTimeout(500);

  // 3. Student Grievance Vault (/my-complaints)
  console.log('📸 3. Capturing Student Grievance Vault...');
  await page.goto(`${baseUrl}/my-complaints`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${outDir}/03-my-complaints-vault.png`, fullPage: false });

  // 4. Ticket Radar & Dossier Scan (/track)
  console.log('📸 4. Capturing Ticket Radar & Dossier Scan...');
  await page.goto(`${baseUrl}/track`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  // Click test ticket chip #101
  await page.evaluate(() => {
    const chip = document.querySelector('.quick-chip[data-id="101"]');
    if (chip) chip.click();
  });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${outDir}/04-ticket-radar-dossier.png`, fullPage: false });

  // 5. System Architecture & ERD Viewer (/architecture)
  console.log('📸 5. Capturing Architecture & ERD Viewer...');
  await page.goto(`${baseUrl}/architecture`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${outDir}/05-architecture-blueprint.png`, fullPage: false });

  await browser.close();
  console.log('🎉 All high-definition screenshots captured successfully into docs/screenshots/!');
}

capture().catch((err) => {
  console.error('Failed to capture screenshots:', err);
  process.exit(1);
});

