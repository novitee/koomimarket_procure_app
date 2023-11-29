export const ROLE_SUPPLIER = 'SUPPLIER';
export const ROLE_BUYER = 'BUYER';

export const SUPPORT_EMAIL = 'support@koomi.com';
export const WHATSAPP_NUMBER = '+6581687729';

const environment: 'development' | 'staging' | 'production' = 'production';

export const baseUrls = {
  development: 'http://localhost:36001',
  staging: 'https://api-procure-dev.koomimarket.com',
  production: 'https://api.koomimarket.com',
};

const dashboardUrls = {
  development: 'https://supplier-procure-dev.koomimarket.com',
  staging: 'https://supplier-procure-dev.koomimarket.com',
  production: 'https://admin-procure-dev.koomimarket.com',
};

export const BASE_URL = `${baseUrls[environment]}/api/v1/procure-storefront/`;
export const SUPPLIER_DASHBOARD_URL = dashboardUrls[environment];
