import { Page } from "@playwright/test";
import { Menu } from "./Menu";

export class NavigationBar extends Menu{
    constructor(page: Page){
        super(page)
    }

    logo = () => {
        return this.page.locator(".brand-logo");
    }

    globalSearch = () => {
        return this.page.getByPlaceholder("Find your servers or sites");
    }

    //TODO: Event Check
    //TODO: Notification Check
    //UserMenu: Check


    
}