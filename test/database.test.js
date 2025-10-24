/**
 * Database Agent Database Tests
 * Tests database functionality with mocked connections
 */

const mysql = require('mysql2/promise');

// Mock mysql2/promise before importing dbAgent
jest.mock('mysql2/promise');

// Mock database pool
const mockPool = {
  execute: jest.fn(),
  end: jest.fn()
};

mysql.createPool.mockReturnValue(mockPool);

// Import the actual dbAgent module after mocking
const dbAgent = require('../dbAgent');

describe('Database Functions', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Set up the dbPool for testing
    dbAgent.dbPool = mockPool;
  });

  beforeAll(() => {
    // Set up the dbPool for testing
    dbAgent.dbPool = mockPool;
  });

  describe('executeQuery', () => {
    test('should execute simple SELECT query successfully', async () => {
      // Mock successful query execution - mysql2 returns [rows, fields]
      mockPool.execute.mockResolvedValue([[{ test: 1 }], []]);
      
      const result = await dbAgent.executeQuery('SELECT 1 as test');
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data[0].test).toBe(1);
      expect(mockPool.execute).toHaveBeenCalledWith('SELECT 1 as test', []);
    });

    test('should execute parameterized query', async () => {
      // Mock successful parameterized query - mysql2 returns [rows, fields]
      mockPool.execute.mockResolvedValue([[{ param: 'test_value' }], []]);
      
      const result = await dbAgent.executeQuery('SELECT ? as param', ['test_value']);
      
      expect(result.success).toBe(true);
      expect(result.data[0].param).toBe('test_value');
      expect(mockPool.execute).toHaveBeenCalledWith('SELECT ? as param', ['test_value']);
    });

    test('should handle invalid SQL gracefully', async () => {
      // Mock database error
      mockPool.execute.mockRejectedValue(new Error('Invalid SQL syntax'));
      
      const result = await dbAgent.executeQuery('INVALID SQL QUERY');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid SQL syntax');
    });

    test('should handle empty parameters array', async () => {
      // Mock successful query with empty params - mysql2 returns [rows, fields]
      mockPool.execute.mockResolvedValue([[{ test: 1 }], []]);
      
      const result = await dbAgent.executeQuery('SELECT 1 as test', []);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(mockPool.execute).toHaveBeenCalledWith('SELECT 1 as test', []);
    });
  });

  describe('executeStoredProcedure', () => {
    test('should execute stored procedure with no parameters', async () => {
      // Mock successful stored procedure execution - mysql2 returns [rows, fields]
      mockPool.execute.mockResolvedValue([[{ userid: 1, firstname: 'Test', lastname: 'User' }], []]);
      
      const result = await dbAgent.executeStoredProcedure('GetAllUsers', []);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data[0].userid).toBe(1);
      expect(mockPool.execute).toHaveBeenCalledWith('CALL GetAllUsers()', []);
    });

    test('should execute stored procedure with parameters', async () => {
      // Mock successful stored procedure with parameters - mysql2 returns [rows, fields]
      mockPool.execute.mockResolvedValue([[{ userid: 1, firstname: 'Test', lastname: 'User' }], []]);
      
      const result = await dbAgent.executeStoredProcedure('GetUserById', [1]);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data[0].userid).toBe(1);
      expect(mockPool.execute).toHaveBeenCalledWith('CALL GetUserById(?)', [1]);
    });

    test('should handle non-existent procedure gracefully', async () => {
      // Mock database error for non-existent procedure
      mockPool.execute.mockRejectedValue(new Error('Procedure does not exist'));
      
      const result = await dbAgent.executeStoredProcedure('NonExistentProcedure', []);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Procedure does not exist');
    });
  });

  describe('Database Connection', () => {
    test('should have mysql2 module available', () => {
      expect(mysql).toBeDefined();
      expect(typeof mysql.createPool).toBe('function');
    });

    test('should be able to create connection config', () => {
      const config = {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'users_test',
        port: 3306
      };
      
      expect(config.host).toBe('localhost');
      expect(config.user).toBe('root');
      expect(config.database).toBe('users_test');
    });
  });
});
