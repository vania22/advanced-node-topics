const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class CustomPage {
    static async build() {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        const customPage = new CustomPage(page);

        await page.setViewport({ width: 1080, height: 1024, deviceScaleFactor: 1 });
        await page.setDefaultTimeout(5000);

        return new Proxy(customPage, {
            get: (target, property) => {
                return target[property] || browser[property] || page[property];
            },
        });
    }

    constructor(page) {
        this.page = page;
    }

    async login() {
        const user = await userFactory();
        const { session, sig } = sessionFactory(user);

        await this.page.setCookie({ name: 'session', value: session });
        await this.page.setCookie({ name: 'session.sig', value: sig });
        await this.page.goto('http://localhost:3000/blogs');
        await this.page.waitForSelector('a[href="/auth/logout"]');
    }

    async getElementText(selector) {
        return await this.page.$eval(selector, (el) => el.innerText);
    }

    async getElement(selector) {
        try {
            return await this.page.$eval(selector, (el) => el);
        } catch (error) {
            return undefined;
        }
    }
}

module.exports = CustomPage;
