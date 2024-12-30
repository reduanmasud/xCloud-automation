import dotenv from 'dotenv';
dotenv.config()

export const hetznerAPI = {
    label: 'HetznerAPI',
    api: ''
}

export const vultrAPI = {
    label: 'VULTR',
    api_key: process.env.VULTR_API || '',
}

export const ClientSercet= {
    email: process.env.CLIENT_USER_EMAIL || '', 
    password: process.env.CLIENT_USER_PASS || '',
    baseURL:  process.env.CLIENT_USER_BASE || '',
    team: process.env.CLIENT_USER_TEAM || '',
}

export const ResellerSecret= {
    email: process.env.RESELLER_USER_EMAIL || '', 
    password: process.env.RESELLER_USER_PASS || '',
    baseURL:  process.env.RESELLER_USER_BASE || '',
    team: process.env.RESELLER_USER_TEAM || '',
}

export const xCloudUserSecret= {
    email: process.env.STARTER_USER_EMAIL || '', 
    password: process.env.STARTER_USER_PASS || '',
    baseURL:  process.env.STARTER_USER_BASE || '',
    team: process.env.STARTER_USER_TEAM || '',
}


export const xCloudUserSecretS1 = {
    email: process.env.STARTER_USER_EMAIL || '', 
    password: process.env.STARTER_USER_PASS || '',
    baseURL:  process.env.STARTER_USER_BASE || '',
    team: process.env.STARTER_USER_TEAM || '',
}



