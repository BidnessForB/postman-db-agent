/**
 * Unit Tests for Database Functions
 * Tests the core database functionality without HTTP layer
 */

const mysql = require('mysql2/promise');
const { initTestDatabase, closeTestDatabase, executeTestQuery } = require('../setup');

// Mock the database functions from dbAgent.js
let dbPool;

async function initDatabase() {
  try {
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'users_test',
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    };
    
    dbPool = mysql.createPool(dbConfig);
    return dbPool;
  } catch (error) {
    throw error;
  }
}

async function executeQuery(sql, params = []) {
  try {
    const [rows] = await dbPool.execute(sql, params);
    return { success: true, data: rows };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function executeStoredProcedure(procedureName, params = []) {
  try {
    const placeholders = params.map(() => '?').join(', ');
    const sql = `CALL ${procedureName}(${placeholders})`;
    
    const [rows] = await dbPool.execute(sql, params);
    return { success: true, data: rows };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

describe('Database Functions', () => {
  beforeAll(async () => {
    await initDatabase();
  });

  afterAll(async () => {
    if (dbPool) {
      await dbPool.end();
    }
  });

  describe('executeQuery', () => {
    test('should execute simple SELECT query successfully', async () => {
      const result = await executeQuery('SELECT 1 as test');
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data[0].test).toBe(1);
    });

    test('should execute parameterized query', async () => {
      const result = await executeQuery('SELECT ? as param', ['test_value']);
      
      expect(result.success).toBe(true);
      expect(result.data[0].param).toBe('test_value');
    });

    test('should handle invalid SQL gracefully', async () => {
      const result = await executeQuery('INVALID SQL QUERY');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('should handle empty parameters array', async () => {
      const result = await executeQuery('SELECT 1 as test', []);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('executeStoredProcedure', () => {
    test('should execute stored procedure with no parameters', async () => {
      // This test assumes GetAllUsers procedure exists
      const result = await executeStoredProcedure('GetAllUsers', []);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    test('should execute stored procedure with parameters', async () => {
      // This test assumes GetUserById procedure exists
      const result = await executeStoredProcedure('GetUserById', [1]);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    test('should handle non-existent procedure gracefully', async () => {
      const result = await executeStoredProcedure('NonExistentProcedure', []);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('should handle procedure with wrong parameter count', async () => {
      const result = await executeStoredProcedure('GetUserById', [1, 2, 3]);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Database Connection', () => {
    test('should establish database connection', async () => {
      expect(dbPool).toBeDefined();
    });

    test('should execute connection test query', async () => {
      const result = await executeQuery('SELECT CONNECTION_ID() as connection_id');
      
      expect(result.success).toBe(true);
      expect(result.data[0].connection_id).toBeGreaterThan(0);
    });
  });
});
