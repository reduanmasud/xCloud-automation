import { Page } from "@playwright/test";

export class Menu {
    constructor(protected page: Page){}

    navigation = this.page.getByRole('navigation');

    dashboard = () => {
        return this.navigation.getByRole('link', {name: 'Dashboard'});
    }

    servers = () => {
        return this.navigation.getByRole('link', {name: 'Servers'});
    }

    sites = () => {
        return this.navigation.getByRole('link', {name: 'Sites'});
    }

    playground = () => {
        return this.navigation.getByRole('link', {name: 'Playground'});
    }


    
}