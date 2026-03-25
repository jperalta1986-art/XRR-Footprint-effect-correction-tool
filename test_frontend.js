const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('http://localhost:8000/index.html', { waitUntil: 'networkidle' });

    console.log("Page loaded");
    await page.waitForTimeout(2000);

    // check linear scale
    await page.selectOption('#scale-toggle', 'linear');
    await page.waitForTimeout(1000);
    const layoutLin = await page.evaluate(() => {
        return document.getElementById('plot').layout;
    });
    console.log('Linear yaxis autorange:', layoutLin.yaxis.autorange);
    console.log('Linear yaxis range:', layoutLin.yaxis.range);

    // switch to log scale and check
    await page.selectOption('#scale-toggle', 'log');
    await page.waitForTimeout(1000);
    const layoutLog = await page.evaluate(() => {
        return document.getElementById('plot').layout;
    });
    console.log('Log yaxis autorange:', layoutLog.yaxis.autorange);
    console.log('Log yaxis range:', layoutLog.yaxis.range);

    // change max to > 1 and min to > 1
    await page.fill('#y-min', '0.5');
    await page.fill('#y-max', '2.5');
    await page.waitForTimeout(1000);
    const layoutLogClamp = await page.evaluate(() => {
        return document.getElementById('plot').layout;
    });
    console.log('Log yaxis clamped range:', layoutLogClamp.yaxis.range);

    await page.selectOption('#scale-toggle', 'linear');
    await page.waitForTimeout(1000);
    const layoutLinClamp = await page.evaluate(() => {
        return document.getElementById('plot').layout;
    });
    console.log('Linear yaxis clamped range:', layoutLinClamp.yaxis.range);

    await browser.close();
})();
