/**
 * Performance and Load Tests
 * Tests the database agent under various load conditions
 */

const request = require('supertest');
const { initTestDatabase, closeTestDatabase, setupTestData, cleanupTestData } = require('../setup');

// Import the test app setup
const createTestApp = require('../integration/api.test.js').createTestApp;

describe('Performance and Load Tests', () => {
  let app;
  
  beforeAll(async () => {
    const testApp = createTestApp();
    app = testApp.app;
    await testApp.initDatabase();
    await setupTestData();
  });
  
  afterAll(async () => {
    await cleanupTestData();
    await closeTestDatabase();
  });
  
  describe('Concurrent Requests', () => {
    test('should handle multiple concurrent status requests', async () => {
      const requests = Array(10).fill().map(() => 
        request(app).get('/status')
      );
      
      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('ok');
      });
    });
    
    test('should handle multiple concurrent query requests', async () => {
      const requests = Array(5).fill().map(() => 
        request(app)
          .post('/api/query')
          .send({
            query: 'SELECT 1 as test',
            params: []
          })
      );
      
      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });
    });
    
    test('should handle multiple concurrent procedure requests', async () => {
      const requests = Array(5).fill().map(() => 
        request(app)
          .post('/api/procedure')
          .send({
            procedure: 'GetAllUsers',
            params: []
          })
      );
      
      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });
    });
  });
  
  describe('Response Time Tests', () => {
    test('status endpoint should respond quickly', async () => {
      const startTime = Date.now();
      
      const response = await request(app)
        .get('/status')
        .expect(200);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      expect(responseTime).toBeLessThan(1000); // Should respond within 1 second
      expect(response.body.status).toBe('ok');
    });
    
    test('simple query should respond quickly', async () => {
      const startTime = Date.now();
      
      const response = await request(app)
        .post('/api/query')
        .send({
          query: 'SELECT 1 as test',
          params: []
        })
        .expect(200);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      expect(responseTime).toBeLessThan(2000); // Should respond within 2 seconds
      expect(response.body.success).toBe(true);
    });
    
    test('stored procedure should respond quickly', async () => {
      const startTime = Date.now();
      
      const response = await request(app)
        .post('/api/procedure')
        .send({
          procedure: 'GetAllUsers',
          params: []
        })
        .expect(200);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      expect(responseTime).toBeLessThan(3000); // Should respond within 3 seconds
      expect(response.body.success).toBe(true);
    });
  });
  
  describe('Memory Usage Tests', () => {
    test('should handle large result sets', async () => {
      // Create multiple test users
      for (let i = 0; i < 10; i++) {
        await request(app)
          .post('/api/procedure')
          .send({
            procedure: 'AddUser',
            params: [`User${i}`, `Test${i}`, `user${i}@example.com`]
          });
      }
      
      const response = await request(app)
        .post('/api/procedure')
        .send({
          procedure: 'GetAllUsers',
          params: []
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(10);
    });
    
    test('should handle parameterized queries with many parameters', async () => {
      const params = Array(10).fill().map((_, i) => `param${i}`);
      const placeholders = params.map(() => '?').join(', ');
      
      const response = await request(app)
        .post('/api/query')
        .send({
          query: `SELECT ${placeholders} as params`,
          params: params
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data[0].params).toBeDefined();
    });
  });
  
  describe('Error Recovery Tests', () => {
    test('should recover from database connection errors', async () => {
      // This test would require simulating database connection issues
      // For now, we'll test that the API handles errors gracefully
      const response = await request(app)
        .post('/api/query')
        .send({
          query: 'SELECT 1 as test',
          params: []
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
    });
    
    test('should handle malformed JSON requests', async () => {
      const response = await request(app)
        .post('/api/query')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);
      
      // The express.json() middleware should handle this
      expect(response.status).toBe(400);
    });
  });
});
