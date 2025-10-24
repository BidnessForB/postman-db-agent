/**
 * Test Setup Configuration
 * Sets up test environment and database connections
 */

const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.test' });

// Test database configuration
const testDbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'users_test',
  port: process.env.DB_PORT || 3306
};

let testDbPool;

/**
 * Initialize test database connection
 */
async function initTestDatabase() {
  try {
    testDbPool = mysql.createPool(testDbConfig);
    console.log('Test database connection created');
    return testDbPool;
  } catch (error) {
    console.log('Test database connection error:', error.message);
    throw error;
  }
}

/**
 * Clean up test database connection
 */
async function closeTestDatabase() {
  if (testDbPool) {
    await testDbPool.end();
    console.log('Test database connection closed');
  }
}

/**
 * Execute test SQL query
 */
async function executeTestQuery(sql, params = []) {
  try {
    const [rows] = await testDbPool.execute(sql, params);
    return { success: true, data: rows };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Setup test data
 */
async function setupTestData() {
  try {
    // Create test user
    await executeTestQuery(`
      INSERT INTO user (firstname, lastname, email, created_at) 
      VALUES (?, ?, ?, NOW())
    `, ['Test', 'User', 'test@example.com']);
    
    // Create test address
    await executeTestQuery(`
      INSERT INTO address (userid, street, city, state, zipcode, country) 
      VALUES (?, ?, ?, ?, ?, ?)
    `, [1, '123 Test St', 'Test City', 'TS', '12345', 'Test Country']);
    
    console.log('Test data setup complete');
  } catch (error) {
    console.log('Test data setup error:', error.message);
  }
}

/**
 * Clean up test data
 */
async function cleanupTestData() {
  try {
    await executeTestQuery('DELETE FROM address WHERE userid = 1');
    await executeTestQuery('DELETE FROM user WHERE userid = 1');
    console.log('Test data cleanup complete');
  } catch (error) {
    console.log('Test data cleanup error:', error.message);
  }
}

module.exports = {
  initTestDatabase,
  closeTestDatabase,
  executeTestQuery,
  setupTestData,
  cleanupTestData,
  testDbConfig
};
