import { Page } from "@playwright/test";

export class xCloudPage {
    private page: Page;
    constructor(page: Page) {
        this.page = page;
    }
}