const puppeteer = require('puppeteer');

class LCR {
  async #login(page, username, password) {
    await page.waitForSelector('.auth-content');
    await page.waitForSelector('#okta-signin-username');

    await page.type('#okta-signin-username', username);

    // await page.click('#okta-signin-submit');
    await page.keyboard.press('Enter');

    await page.waitForSelector('.password-with-toggle');
    await page.type('.password-with-toggle', password);

    await page.keyboard.press('Enter');

    await page.waitForSelector('#__next');
    await page.goto('https://lcr.churchofjesuschrist.org/report/new-member');
  }

  async #getNewMembersData(page) {
    await page.waitForSelector('#dataTable');
    const newMembers = await page.evaluate(() => {
      let tds = Array.from(document.querySelectorAll('table tr'));
      tds = tds.map((td) => td.innerText);

      const out = [];
      tds.forEach((element, index) => {
        if (index !== 0) {
          const info = element.split('\t');
          const ret = {
            name: info[0],
            age: info[1],
            gender: info[2],
            responsibility: info[3],
          };
          out.push(ret);
        }
      });

      return out;
    });
    return newMembers;
  }

  async syncData(username, password) {
    const syncRet = {};

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://lcr.churchofjesuschrist.org/');

    await this.#login(page, username, password);

    const newMembersData = await this.#getNewMembersData(page);

    syncRet.newMembers = newMembersData;

    return syncRet;
  }
}

module.exports = LCR;
