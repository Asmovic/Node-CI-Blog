const Page = require('./helpers/Page');


let page;

beforeEach(async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000');
});

afterEach(async () => {
    await page.close();
});




describe('When logged in', () => {
    beforeEach(async () => {
        await page.login();
        await page.click('a.btn-floating');
    });

    test('Can see blog create form', async () => {
        const label = await page.getContentsOf('form label');
        expect(label).toEqual('Blog Title');
    });

    describe('And using invalid input', () => {
        beforeEach(async () => {
            await page.click('form button');
        })

        test('The form shows error message', async () => {
            const titleError = await page.getContentsOf('.title .red-text');
            const contentError = await page.getContentsOf('.content .red-text');

            expect(titleError).toEqual('You must provide a value');
            expect(contentError).toEqual('You must provide a value');
        })
    });

    describe('And using valid input', () => {
        beforeEach(async () => {
            await page.type('.title input', 'Holiday');
            await page.type('.content input', 'Vacation in Ibiza is awesome');
            await page.click('form button');
        })

        test('Submitting take user to review screen', async () => {
            const text = await page.getContentsOf('h5');
            expect(text).toEqual('Please confirm your entries');
        });

        test('Submitting then saving adds blog to index page', async () => {
            await page.click('button.green');
            await page.waitForSelector('.card');

            const title = await page.getContentsOf('.card-title');
            const content = await page.getContentsOf('p');

            expect(title).toEqual('Holiday');
            expect(content).toEqual('Vacation in Ibiza is awesome');
        });
    })
});


describe('When user not logged in', () => {
    test('User cannot create Blog posts', async () => {

        const result = await page.evaluate(
            () => {
                return fetch('/api/blogs', {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title: 'My Title', content: 'My Content' })
                }).then(res => res.json());
            }
        );

        expect(result).toEqual({ error: 'You must log in!' })
    });

    test('User cannot get list of posts', async () => {

        const result = await page.evaluate(
            () => {
                return fetch('/api/blogs', {
                    method: 'GET',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(res => res.json());
            }
        );

        expect(result).toEqual({ error: 'You must log in!' })
    })
})
