const Page = require('./helpers/Page');

let page;

beforeEach(async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000');
});

afterEach(async () => {
    await page.close();
})
test('The Header has the correct Text', async () => {

    const text = await page.$eval('a.brand-logo', el => el.innerHTML);
    expect(text).toEqual('Blogster');
});

test('Clicking login button starts 0auth flow', async () => {
    await page.click('.right a');
    const url = await page.url();

    expect(url).toMatch('/accounts\.google\.com');
});

test('When signed in, shows logout button', async () => {
    await page.login();

    const text = await page.getContentsOf('a[href="/auth/logout"]');

    expect(text).toEqual('Logout');
})