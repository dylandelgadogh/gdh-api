export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

export const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10');

// Database
export const DATABASE_HOST = process.env.DATABASE_HOST || 'localhost';
export const DATABASE_NAME = process.env.DATABASE_NAME || '';
export const DATABASE_USER = process.env.DATABASE_USER || '';
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || '';
export const DATABASE_PORT = process.env.DATABASE_PORT || '5432';

export const SANDBOX_URL = process.env.SANDBOX_URL || '';
export const SANDBOX_API_KEY = process.env.SANDBOX_API_KEY || '';