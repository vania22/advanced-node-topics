const Page = require('./helpers/page');

let page;

beforeEach(async () => {
    page = await Page.build();
    await page.setViewport({ width: 1080, height: 1024, deviceScaleFactor: 1 });

    await page.goto('http://localhost:3000');
});

afterEach(async () => {
    await page.close();
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
    await page.login();

    const text = await page.$eval('a[href="/auth/logout"]', (el) => el.innerText);

    expect(text).toEqual('Logout');
});
