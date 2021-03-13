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

describe('While not logged in', () => {
    test('Login button present', async () => {
        const loginButtonText = await page.getElementText('a[href="/auth/google"]');
        expect(loginButtonText).toEqual('Login With Google');
    });

    test('Navigate to google once login btn pressed', async () => {
        await page.click('a[href="/auth/google"]');
        const pageTitle = await page.title();

        expect(pageTitle).toEqual('Sign in – Google accounts');
    });

    test('Blogs are not visible', async () => {
        await page.goto('http://localhost:3000/blogs');
        const blogs = await page.getElement('div[class="card darken-1 horizontal"]');
        expect(blogs).toBe(undefined);
    });

    test('Not able to create blogs', async () => {
        await page.goto('http://localhost:3000/blogs');
        await page.click('a[href="/blogs/new"]');
        await page.type('input[name="title"]', 'test');
        await page.type('input[name="content"]', 'test');
        await page.click('button[type="submit"]');
        await page.click('button[class="yellow darken-3 white-text btn-flat"]');
        await page.waitForTimeout(2000);
        const pageURL = await page.url();

        expect(pageURL).toMatch(/(\/blogs\/new)/i);

        await page.goto('http://localhost:3000/blogs');
        const blogs = await page.getElement('div[class="card darken-1 horizontal"]');
        expect(blogs).toBe(undefined);
    });
});
