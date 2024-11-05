## Steps of setup
1. Clone the project
2. Add your `secrets.ts` file to configs folder
3. Goto Project Folder `cd xCloud-automation`
4. run `npm i`

## `secrets.ts` File
```ts
export const hetznerAPI = {
    label: 'HetznerAPI',
    api: ''
}

export const vultrAPI = {
    label: 'VULTR',
    api_key: "TV6UJYRK............QECXBTJA"
}

export const ClientSercet= {
    email: "example@email.com",
    password: "password"
}

export const ResellerSecret= {
    email: "example@email.com",
    password: "password"
}

export const xCloudUserSecret= {
    email: "example@email.com",
    password: "password"
}
```
## Update the `config.ts` file accordingly too.

## Run your test

### Client Link Permission Test

```bash
npx playwright test tests/whitelevel/link-permission-check.spec.ts --workers=5
```
