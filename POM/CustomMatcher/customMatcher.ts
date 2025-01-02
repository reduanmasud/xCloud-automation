import { Locator } from "@playwright/test";

export const customMatchers = {
    async isImgLoaded(this: any, received: Locator) {

        if (!received || typeof received.evaluate !== 'function') {
            return {
                message: () => `Expected a Playwright Locator but received ${typeof received}`,
                pass: false,
            };
        }

        try {
            // Wait for the image to be visible and ready
            await received.waitFor({ state: 'visible', timeout: 5000 });

            const isLoaded = await received.evaluate(
                (img: HTMLImageElement) => img.complete && img.naturalWidth > 0
            );

            if (isLoaded) {
                return {
                    message: () => `Expected image not to be loaded, but it is loaded.`,
                    pass: true,
                };
            } else {
                return {
                    message: () => `Expected image to be loaded, but it is not.`,
                    pass: false,
                };
            }
        } catch (err) {
            return {
                message: () => `Expected image to be loaded, but it didn't load in time.`,
                pass: false,
            };
        }
    },

    async cssAfterHas(this: any, received: Locator, property: string, value: string) {
        if (!received || typeof received.evaluate !== 'function') {
            return {
                message: () => `Expected a Playwright Locator but received ${typeof received}`,
                pass: false,
            };
        }
    
        try {
            // Wait for the element to be visible
            await received.waitFor({ state: 'visible', timeout: 5000 });
    
            // Get the computed CSS property value for the ::after pseudo-element
            const cssValue = await received.evaluate(
                (el: HTMLElement, property: string) => {
                    // Target the ::after pseudo-element using getComputedStyle
                    const computedStyle = window.getComputedStyle(el, '::after');
                    return computedStyle.getPropertyValue(property).trim();
                },
                property
            );
    
            // Check if the CSS value matches the expected value
            if (cssValue === value) {
                return {
                    message: () => `Expected element not to have CSS property "${property}" with value "${value}", but it does.`,
                    pass: true,  // Pass: The property value matches the expected value
                };
            } else {
                return {
                    message: () => `Expected element to have CSS property "${property}" with value "${value}", but found "${cssValue}".`,
                    pass: false,  // Fail: The property value doesn't match the expected value
                };
            }
        } catch (err) {
            return {
                message: () => `Failed to check CSS property "${property}" due to an error: ${err instanceof Error ? err.message : 'unknown error'}`,
                pass: false,  // Fail: Something went wrong (e.g., timeout or invalid selector)
            };
        }
    },
    
    async cssBeforeHas(this: any, received: Locator, property: string, value: string) {
        if (!received || typeof received.evaluate !== 'function') {
            return {
                message: () => `Expected a Playwright Locator but received ${typeof received}`,
                pass: false,
            };
        }
    
        try {
            // Wait for the element to be visible
            await received.waitFor({ state: 'visible', timeout: 5000 });
    
            // Get the computed CSS property value for the ::before pseudo-element
            const cssValue = await received.evaluate(
                (el: HTMLElement, property: string) => {
                    // Target the ::before pseudo-element using getComputedStyle
                    const computedStyle = window.getComputedStyle(el, '::before');
                    return computedStyle.getPropertyValue(property).trim();
                },
                property
            );
    
            // Check if the CSS value matches the expected value
            if (cssValue === value) {
                return {
                    message: () => `Expected element not to have CSS property "${property}" with value "${value}", but it does.`,
                    pass: true,  // Pass: The property value matches the expected value
                };
            } else {
                return {
                    message: () => `Expected element to have CSS property "${property}" with value "${value}", but found "${cssValue}".`,
                    pass: false,  // Fail: The property value doesn't match the expected value
                };
            }
        } catch (err) {
            return {
                message: () => `Failed to check CSS property "${property}" due to an error: ${err.message}`,
                pass: false,  // Fail: Something went wrong (e.g., timeout or invalid selector)
            };
        }
    }
    
};
