const puppeteer = require('puppeteer');
const sessionFactory = require('./factories/sessionFactory');
const userFactory = require('./factories/userFactory');

let browser, page;

beforeEach(async () => {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1024, deviceScaleFactor: 1 });

    await page.goto('http://localhost:3000');
});

afterEach(async () => {
    await browser.close();
});

test('Verify logo text', async () => {
    const header = await page.$eval('h1', (h1) => h1.innerText);

    expect(header).toEqual('Blogster!');
});

test('Check that user taken to google when clicks login button', async () => {
    await page.click('ul.right a');
    const pageTitle = await page.title();

    expect(pageTitle).toEqual('Sign in – Google accounts');
});

test.only('Logout button present if user logged in', async () => {
    // const userId = '60478183feb5da3128e26438';
    const user = await userFactory();
    console.log(user);
    const { session, sig } = sessionFactory(user);

    await page.setCookie({ name: 'session', value: session });
    await page.setCookie({ name: 'session.sig', value: sig });
    await page.goto('http://localhost:3000');
    await page.waitForSelector('a[href="/auth/logout"]');
    const text = await page.$eval('a[href="/auth/logout"]', (el) => el.innerText);

    expect(text).toEqual('Logout');
});
