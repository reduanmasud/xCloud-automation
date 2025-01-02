import { Locator } from '@playwright/test';

declare global {
    namespace PlaywrightTest {
        interface Matchers<R> {
            isImgLoaded(): R;
            cssAfterHas(property: string, value: string): R;
            cssBeforeHas(property: string, value: string): R;
        }
    }
}