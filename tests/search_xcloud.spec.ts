import { test, expect } from "@playwright/test";
import exp from "constants";
import { baseConfig } from "../config/config";

const url:string[] = [

]

const baseURL = ''
const userEmail = baseConfig.email
const userPass = baseConfig.pass


test("Test Test", async ({page}) => {
    // await page.goto('/login');
    // // await page.waitForLoadState('domcontentloaded');

    // await page.waitForLoadState('domcontentloaded');
    // await page.getByPlaceholder('Email Address..').click();
    // await page.getByPlaceholder('Email Address..').pressSequentially(userEmail);
    // await page.getByPlaceholder('********').click();
    // await page.getByPlaceholder('********').pressSequentially(userPass);
    // await page.locator('span').filter({ hasText: 'Remember me' }).first().click();
    
    // await page.getByRole('button', { name: 'Log In' }).click();
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveTitle(/Dashboard/);
})


