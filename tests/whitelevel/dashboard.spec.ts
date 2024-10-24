/**
 * Case 1: Check Total Customers Text
 * Case 2: Total Customers count
 * Case 3: Total Customers info Icon & Text
 * Case 4: Check Total Products Text
 * Case 5: Total Products count
 * Case 6: Total Products info Icon & Text
 * Case 7: Check Total Servers Text
 * Case 8: Total Servers count
 * Case 9: Total Servers info Icon & Text
 * Case 10: Check Total Sites Text
 * Case 12: Total Sites count
 * Case 13: Total Sites info Icon & Text
 * Case 14: Servers section and all it's elements
 * Case 15: Sites section and all it's elements
 * 
 */

import {type Locator, test, type Page, expect} from '@playwright/test'

let page: Page
let countCards: Locator
test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    //Goto Section
    countCards = page.locator(`//div[@class='flex flex-col p-6 gap-4 bg-white dark:bg-mode-light w-full rounded-lg']`);
})

test(`Test Total Customers Count Card`, async() => {
    await expect(countCards.filter({hasText:/Total Customers/}).getByText(/Total Customers/).count()).toBe(2);
    await expect(countCards.filter({hasText:/Total Customers/}).locator('h3').allInnerTexts()).toMatch(/[0-9]+/)
})

test(`Test Total Products Count Card`, async() => {
    await expect(countCards.filter({hasText:/Total Products/}).getByText(/Total Products/).count()).toBe(2);
    await expect(countCards.filter({hasText:/Total Products/}).locator('h3').allInnerTexts()).toMatch(/[0-9]+/)

})

test(`Test Total Servers Count Card`, async() => {
    await expect(countCards.filter({hasText:/Total Servers/}).getByText(/Total Servers/).count()).toBe(2);
    await expect(countCards.filter({hasText:/Total Servers/}).locator('h3').allInnerTexts()).toMatch(/[0-9]+/)

})

test(`Test Total Sites Count Card`, async() => {
    await expect(countCards.filter({hasText:/Total Sites/}).getByText(/Total Sites/).count()).toBe(2);
    await expect(countCards.filter({hasText:/Total Sites/}).locator('h3').allInnerTexts()).toMatch(/[0-9]+/)

})