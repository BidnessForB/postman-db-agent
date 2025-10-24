/**
 * API Tests for Database Agent
 * Tests the HTTP API functionality with mocked database
 */

const request = require('supertest');
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

describe('API Tests', () => {
  let app;
  
  beforeAll(() => {
    // Get the Express app from dbAgent
    app = dbAgent.app;
    // Set up the dbPool for testing
    dbAgent.dbPool = mockPool;
  });

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Set up the dbPool for testing
    dbAgent.dbPool = mockPool;
  });
  
  describe('GET /status', () => {
    test('should return status information', async () => {
      const response = await request(app)
        .get('/status')
        .expect(200);
      
      expect(response.body.status).toBe('ok');
      expect(response.body.message).toBe('Database agent is running');
      expect(response.body.timestamp).toBeDefined();
    });
  });
  
  describe('POST /api/query', () => {
    test('should execute simple SELECT query', async () => {
      // Mock successful query execution - mysql2 returns [rows, fields]
      mockPool.execute.mockResolvedValue([[{ test: 1 }], []]);
      
      const response = await request(app)
        .post('/api/query')
        .send({
          query: 'SELECT 1 as test',
          params: []
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data[0].test).toBe(1);
      expect(response.body.count).toBe(1);
      expect(mockPool.execute).toHaveBeenCalledWith('SELECT 1 as test', []);
    });
    
    test('should execute parameterized query', async () => {
      // Mock successful parameterized query - mysql2 returns [rows, fields]
      mockPool.execute.mockResolvedValue([[{ param: 'test_value' }], []]);
      
      const response = await request(app)
        .post('/api/query')
        .send({
          query: 'SELECT ? as param',
          params: ['test_value']
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data[0].param).toBe('test_value');
      expect(mockPool.execute).toHaveBeenCalledWith('SELECT ? as param', ['test_value']);
    });
    
    test('should return error for missing query', async () => {
      const response = await request(app)
        .post('/api/query')
        .send({})
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('SQL query is required');
    });
    
    test('should handle invalid SQL gracefully', async () => {
      // Mock database error
      mockPool.execute.mockRejectedValue(new Error('Invalid SQL syntax'));
      
      const response = await request(app)
        .post('/api/query')
        .send({
          query: 'INVALID SQL QUERY',
          params: []
        })
        .expect(500);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid SQL syntax');
    });
  });
  
  describe('POST /api/procedure', () => {
    test('should execute stored procedure with no parameters', async () => {
      // Mock successful stored procedure execution - mysql2 returns [rows, fields]
      mockPool.execute.mockResolvedValue([[{ userid: 1, firstname: 'Test', lastname: 'User' }], []]);
      
      const response = await request(app)
        .post('/api/procedure')
        .send({
          procedure: 'GetAllUsers',
          params: []
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.procedure).toBe('GetAllUsers');
      expect(mockPool.execute).toHaveBeenCalledWith('CALL GetAllUsers()', []);
    });
    
    test('should execute stored procedure with parameters', async () => {
      // Mock successful stored procedure with parameters - mysql2 returns [rows, fields]
      mockPool.execute.mockResolvedValue([[{ userid: 1, firstname: 'Test', lastname: 'User' }], []]);
      
      const response = await request(app)
        .post('/api/procedure')
        .send({
          procedure: 'GetUserById',
          params: [1]
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.procedure).toBe('GetUserById');
      expect(mockPool.execute).toHaveBeenCalledWith('CALL GetUserById(?)', [1]);
    });
    
    test('should return error for missing procedure name', async () => {
      const response = await request(app)
        .post('/api/procedure')
        .send({})
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Procedure name is required');
    });
    
    test('should handle non-existent procedure gracefully', async () => {
      // Mock database error for non-existent procedure
      mockPool.execute.mockRejectedValue(new Error('Procedure does not exist'));
      
      const response = await request(app)
        .post('/api/procedure')
        .send({
          procedure: 'NonExistentProcedure',
          params: []
        })
        .expect(500);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Procedure does not exist');
    });
  });
  
  describe('Error Handling', () => {
    test('should return 404 for unknown endpoint', async () => {
      const response = await request(app)
        .get('/unknown-endpoint')
        .expect(404);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Endpoint not found');
    });
  });
});
