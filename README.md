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
npx playwright test tests/whitelevel/link-permission-check.spec.ts --workers=5 --project=chromium
```
### Developer Documentation for Server and Site Management Classes

---

## Overview

This documentation provides an overview of the `Server` and `Site` classes and their integration for server and site management. The modular design enables easy creation and management of servers and sites, supporting reusable logic and extensibility.

---

## Classes and Their Responsibilities

### 1. **Server Class**

#### Purpose:
Manages server-related operations, such as provisioning and maintaining server details.

#### Properties:
- **page**: Instance of the `Page` object for automation.
- **serverId**: Unique identifier for the server.
- **serverProvider**: Enum representing the server provider (e.g., AWS, GCP, VULTR).
- **name**: Name of the server.
- **dbEngine**: Enum representing the database engine (e.g., MySQL, PostgreSQL).
- **region**: Geographic region where the server is hosted.
- **serverType**: Type of server (e.g., development, production).
- **sites**: Array to store associated `Site` instances.
- **options**: Optional server configuration (e.g., backup enablement, billing).

#### Methods:
1. **Constructor**:
   ```typescript
   constructor(page: Page, serverId: string | null, optional?: { /* options */ });
   ```
   - Initializes a server with an existing `serverId` or creates a new one using optional parameters.

2. **provisionServer()**:
   Provisions a new server based on the specified options and provider.

   ```typescript
   async provisionServer(): Promise<void>;
   ```

3. **createSite()**:
   Creates a new site on the server.

   ```typescript
   async createSite(name: string, options?: { phpVersion?: string; wpVersion?: string; }): Promise<void>;
   ```

---

### 2. **Site Class**

#### Purpose:
Handles site-specific details and operations, such as provisioning and configurations.

#### Properties:
- **name**: Name of the site.
- **url**: URL of the site.
- **siteId**: Unique identifier for the site.
- **server**: Reference to the associated `Server` instance or `string` serverId.
- **phpVersion**: PHP version to be used by the site.
- **wpVersion**: WordPress version for the site.
- **blueprint**: Indicates if a blueprint is used for the site.
- **page**: Instance of the `Page` object for automation.

#### Methods:
1. **Constructor**:
   ```typescript
   constructor(page: Page, server: Server | string, siteId: string | null, optional?: { /* options */ });
   ```
   - Initializes a new site instance associated with a server.

2. **provisionSite()**:
   Automates the process of provisioning the site.

   ```typescript
   async provisionSite(): Promise<void>;
   ```

---

## Usage Examples

### 1. **Creating a New Server**
```typescript
const server = new Server(page, null, {
    serverProvider: ServerProvider.VULTR,
    name: 'Test Server',
    dbEngine: DBEngine.MYSQL,
    size: 'small',
    region: 'us-east',
    serverType: ServerType.PRODUCTION,
});
await server.provisionServer();
```

### 2. **Using an Existing Server**
```typescript
const existingServer = new Server(page, 'existing-server-id');
```

### 3. **Creating a Site**
```typescript
await server.createSite('My Blog', {
    phpVersion: '8.1',
    wpVersion: '6.3',
});
```

### 4. **Verifying Sites**
```typescript
console.log(server.sites); // Array of Site instances
```

---

## Error Handling

- **Server**: If required parameters are missing during provisioning, an error is thrown.
- **Site**: If `siteId` is `null` and optional parameters are missing, an error is thrown.

---

## Extensibility

- **Adding New Server Providers**: Update the `ServerProvider` enum and implement provider-specific logic in `provisionServer()`.
- **Custom Site Options**: Extend the `Site` constructor to handle additional configurations.

---

## Testing Instructions

1. **Setup**:
   - Install dependencies.
   - Initialize a `Page` instance from your automation framework (e.g., Playwright).

2. **Test Server Creation**:
   ```typescript
   const server = new Server(page, null, { /* options */ });
   await server.provisionServer();
   ```

3. **Test Site Creation**:
   ```typescript
   await server.createSite('Test Site', { phpVersion: '8.0' });
   ```

---

## Key Considerations

- **Concurrency**: Ensure only one server or site is being provisioned at a time to avoid race conditions.
- **Security**: Validate inputs to prevent malformed configurations.

---

This documentation serves as a reference for developers working with server and site management in the system.
