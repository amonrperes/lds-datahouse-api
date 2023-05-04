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
    await page.waitForSelector('.sc-1tfwysu-0.bqnquP');
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

    const browser = await puppeteer.launch({ headless: true, defaultViewport: {
      width:1920,
      height:1080
    } });
    const page = await browser.newPage();

    await page.goto('https://lcr.churchofjesuschrist.org/');

    await this.#login(page, username, password);

    let newMembersData;

    try {
      newMembersData = await this.#getNewMembersData(page);
    } catch(err) {
      syncRet.message = 'Error accessing lcr. Please, contact amon.r.peres@gmail.com';
      return syncRet;
    }

    syncRet.newMembers = newMembersData;

    return syncRet;
  }

  async checkUserAuthenticity(username, password) {
    const ret = {
      status: 'ERROR',
      message: 'Access Denied'
    }

    const browser = await puppeteer.launch({ headless: true, defaultViewport: {
      width:1920,
      height:1080
    } });
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

    try {
      await page.waitForSelector('.sc-1u44evz-0.JDVKk.sc-2c415096-3.kcTgDY');

      const stakeInfo = await page.evaluate(() => {
        const element = document.querySelector('.sc-1u44evz-0.JDVKk.sc-2c415096-3.kcTgDY');
        return element.innerText;
      })

      const wardInfo = await page.evaluate(() => {
        const element = document.querySelector('.sc-2c415096-1.VEfQV');
        return element.innerText;
      });

      const numberPattern = /\d+/g;
      const stringPattern = /[a-zA-ZÀ-ú]+/g;

      const stakeId = stakeInfo.match(numberPattern).join();
      const stakeName = stakeInfo.match(stringPattern).join(' ');

      const wardId = wardInfo.match(numberPattern).join();
      const wardName = wardInfo.match(stringPattern).join(' ');

      ret.status = 'OK';
      ret.message = 'User Authenticated';
      ret.data = {
        stakeId,
        stakeName,
        wardId,
        wardName
      };
    } catch(err) {
      console.log(err);
    }

    return ret;
  }
}

module.exports = LCR;
