const puppeteer = require('puppeteer');

class LCR {
    async syncData(username, password) {
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();

        await page.goto('https://lcr.churchofjesuschrist.org/');
        await page.waitForSelector('.auth-content');
        await page.waitForSelector('#okta-signin-username');
    
        await page.type('#okta-signin-username', username);
    
        // await page.click('#okta-signin-submit');
        await page.keyboard.press('Enter'); 
    
        await page.waitForSelector('.password-with-toggle');
        await page.type('.password-with-toggle', password);
    
        await page.keyboard.press('Enter');
    } 
}

module.exports = LCR;