import { Page } from "@playwright/test";

export interface PagexCloud extends Page {
    waitForText(locator: string, text: string, timeout?: number): Promise<void>;
}