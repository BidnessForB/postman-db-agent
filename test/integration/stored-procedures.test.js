/**
 * Integration Tests for Stored Procedures
 * Tests the stored procedure functionality end-to-end
 */

const request = require('supertest');
const { initTestDatabase, closeTestDatabase, setupTestData, cleanupTestData } = require('../setup');

// Import the test app setup
const createTestApp = require('./api.test.js').createTestApp;

describe('Stored Procedures Integration Tests', () => {
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
  
  describe('User Creation Procedures', () => {
    test('should create user with AddUser procedure', async () => {
      const response = await request(app)
        .post('/api/procedure')
        .send({
          procedure: 'AddUser',
          params: ['John', 'Doe', 'john.doe@example.com']
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data[0].new_user_id).toBeGreaterThan(0);
    });
    
    test('should create user with address using AddUserWithAddress procedure', async () => {
      const response = await request(app)
        .post('/api/procedure')
        .send({
          procedure: 'AddUserWithAddress',
          params: [
            'Jane', 'Smith', 'jane.smith@example.com',
            '456 Oak St', 'Boston', 'MA', '02101', 'USA'
          ]
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data[0].new_user_id).toBeGreaterThan(0);
    });
  });
  
  describe('User Query Procedures', () => {
    test('should get all users with GetAllUsers procedure', async () => {
      const response = await request(app)
        .post('/api/procedure')
        .send({
          procedure: 'GetAllUsers',
          params: []
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });
    
    test('should get user by ID with GetUserById procedure', async () => {
      const response = await request(app)
        .post('/api/procedure')
        .send({
          procedure: 'GetUserById',
          params: [1]
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });
    
    test('should search users with SearchUsers procedure', async () => {
      const response = await request(app)
        .post('/api/procedure')
        .send({
          procedure: 'SearchUsers',
          params: ['Test']
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
  
  describe('User Update Procedures', () => {
    test('should update user with UpdateUser procedure', async () => {
      const response = await request(app)
        .post('/api/procedure')
        .send({
          procedure: 'UpdateUser',
          params: [1, 'Updated', 'User', 'updated@example.com']
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data[0].affected_rows).toBeGreaterThanOrEqual(0);
    });
    
    test('should update user with address using UpdateUserAddress procedure', async () => {
      const response = await request(app)
        .post('/api/procedure')
        .send({
          procedure: 'UpdateUserAddress',
          params: [
            1, 'Updated', 'User', 'updated@example.com',
            '789 New St', 'New City', 'NC', '54321', 'USA'
          ]
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data[0].affected_rows).toBeGreaterThanOrEqual(0);
    });
  });
  
  describe('User Deletion Procedures', () => {
    test('should delete user address with DeleteUserAddress procedure', async () => {
      const response = await request(app)
        .post('/api/procedure')
        .send({
          procedure: 'DeleteUserAddress',
          params: [1]
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data[0].affected_rows).toBeGreaterThanOrEqual(0);
    });
    
    test('should delete user with DeleteUser procedure', async () => {
      // Create a test user first
      await request(app)
        .post('/api/procedure')
        .send({
          procedure: 'AddUser',
          params: ['Delete', 'Test', 'delete@example.com']
        });
      
      const response = await request(app)
        .post('/api/procedure')
        .send({
          procedure: 'DeleteUser',
          params: [2] // Assuming this is the new user ID
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data[0].affected_rows).toBeGreaterThanOrEqual(0);
    });
  });
  
  describe('Error Handling', () => {
    test('should handle procedure with wrong parameter count', async () => {
      const response = await request(app)
        .post('/api/procedure')
        .send({
          procedure: 'GetUserById',
          params: [1, 2, 3] // Too many parameters
        })
        .expect(500);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
    
    test('should handle procedure with wrong parameter types', async () => {
      const response = await request(app)
        .post('/api/procedure')
        .send({
          procedure: 'GetUserById',
          params: ['invalid_id'] // Should be integer
        })
        .expect(500);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });
});
