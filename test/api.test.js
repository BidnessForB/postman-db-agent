/**
 * API Tests for Database Agent
 * Tests the HTTP API functionality with mocked database
 */

const request = require('supertest');
const express = require('express');
const cors = require('cors');

// Create a test version of the app
const createTestApp = () => {
  const app = express();
  
  // Middleware
  app.use(express.json());
  app.use(cors());
  
  // Mock database functions
  const executeQuery = async (sql, params = []) => {
    try {
      if (sql.includes('SELECT 1')) {
        return { success: true, data: [{ test: 1 }] };
      }
      if (sql.includes('SELECT ?')) {
        return { success: true, data: [{ param: params[0] }] };
      }
      if (sql.includes('INVALID')) {
        throw new Error('Invalid SQL syntax');
      }
      return { success: true, data: [] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  const executeStoredProcedure = async (procedureName, params = []) => {
    try {
      if (procedureName === 'GetAllUsers') {
        return { success: true, data: [{ userid: 1, firstname: 'Test', lastname: 'User' }] };
      }
      if (procedureName === 'GetUserById') {
        return { success: true, data: [{ userid: params[0], firstname: 'Test', lastname: 'User' }] };
      }
      if (procedureName === 'NonExistentProcedure') {
        throw new Error('Procedure does not exist');
      }
      return { success: true, data: [] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  // API Routes
  app.get('/status', (req, res) => {
    res.json({ 
      status: 'ok', 
      message: 'Database agent is running',
      timestamp: new Date().toISOString()
    });
  });
  
  app.post('/api/query', async (req, res) => {
    try {
      const { query, params = [] } = req.body;
      
      if (!query) {
        return res.status(400).json({ 
          success: false, 
          error: 'SQL query is required' 
        });
      }
      
      const result = await executeQuery(query, params);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          count: result.data.length
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error
        });
      }
      
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  });
  
  app.post('/api/procedure', async (req, res) => {
    try {
      const { procedure, params = [] } = req.body;
      
      if (!procedure) {
        return res.status(400).json({ 
          success: false, 
          error: 'Procedure name is required' 
        });
      }
      
      const result = await executeStoredProcedure(procedure, params);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          count: result.data.length,
          procedure: procedure
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error
        });
      }
      
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  });
  
  // Error handling
  app.use((err, req, res, next) => {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  });
  
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: 'Endpoint not found'
    });
  });
  
  return app;
};

describe('API Tests', () => {
  let app;
  
  beforeAll(() => {
    app = createTestApp();
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
    });
    
    test('should execute parameterized query', async () => {
      const response = await request(app)
        .post('/api/query')
        .send({
          query: 'SELECT ? as param',
          params: ['test_value']
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data[0].param).toBe('test_value');
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
      const response = await request(app)
        .post('/api/query')
        .send({
          query: 'INVALID SQL QUERY',
          params: []
        })
        .expect(500);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });
  
  describe('POST /api/procedure', () => {
    test('should execute stored procedure with no parameters', async () => {
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
    });
    
    test('should execute stored procedure with parameters', async () => {
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
      const response = await request(app)
        .post('/api/procedure')
        .send({
          procedure: 'NonExistentProcedure',
          params: []
        })
        .expect(500);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
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
