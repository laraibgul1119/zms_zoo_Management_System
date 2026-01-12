// Simple startup script with better error handling
console.log('Starting Zoo Management Backend...');
console.log('Node version:', process.version);
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT || 3001);
console.log('Database path:', process.env.DATABASE_PATH || 'default');

try {
    require('./dist/index.js');
} catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
}
