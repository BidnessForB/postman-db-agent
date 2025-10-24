# Database Agent Tests

This directory contains comprehensive tests for the database agent application.

## Test Structure

```
test/
├── setup.js                    # Test setup and configuration
├── unit/                       # Unit tests
│   └── database.test.js        # Database function tests
├── integration/                # Integration tests
│   ├── api.test.js            # API endpoint tests
│   └── stored-procedures.test.js # Stored procedure tests
├── performance/               # Performance tests
│   └── load.test.js           # Load and performance tests
└── README.md                  # This file
```

## Test Categories

### Unit Tests
- **Database Functions**: Tests core database functionality without HTTP layer
- **Connection Management**: Tests database connection and pooling
- **Query Execution**: Tests SQL query execution and error handling

### Integration Tests
- **API Endpoints**: Tests full HTTP API functionality
- **Stored Procedures**: Tests end-to-end stored procedure execution
- **Error Handling**: Tests API error responses and edge cases

### Performance Tests
- **Load Testing**: Tests concurrent request handling
- **Response Time**: Tests API response times under load
- **Memory Usage**: Tests handling of large result sets

## Running Tests

### Prerequisites
1. Install test dependencies:
   ```bash
   npm install
   ```

2. Set up test database:
   ```bash
   # Copy test environment configuration
   cp test.env.example .env.test
   
   # Edit .env.test with your test database settings
   # Make sure to use a separate test database (e.g., users_test)
   ```

3. Set up test database schema:
   ```bash
   # Run the database setup script with test database
   DB_NAME=users_test ./db/setup_database.sh
   ```

### Test Commands

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
npm run test:performance   # Performance tests only

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Configuration

### Environment Variables
Tests use the `.env.test` file for configuration:
- `DB_HOST`: Database host (default: localhost)
- `DB_USER`: Database username (default: root)
- `DB_PASSWORD`: Database password (default: empty)
- `DB_NAME`: Test database name (default: users_test)
- `DB_PORT`: Database port (default: 3306)
- `PORT`: Test server port (default: 3001)

### Test Database
- Tests use a separate test database (`users_test` by default)
- Test data is automatically set up and cleaned up
- Each test run starts with a clean database state

## Test Coverage

The test suite covers:
- ✅ Database connection and pooling
- ✅ SQL query execution
- ✅ Stored procedure execution
- ✅ API endpoint functionality
- ✅ Error handling and edge cases
- ✅ Performance under load
- ✅ Concurrent request handling

## Writing New Tests

### Unit Tests
Create tests in `test/unit/` directory:
```javascript
describe('Your Function', () => {
  test('should do something', () => {
    // Test implementation
  });
});
```

### Integration Tests
Create tests in `test/integration/` directory:
```javascript
describe('API Endpoint', () => {
  test('should handle request', async () => {
    const response = await request(app)
      .post('/api/endpoint')
      .send({ data: 'test' })
      .expect(200);
    
    expect(response.body.success).toBe(true);
  });
});
```

### Performance Tests
Create tests in `test/performance/` directory:
```javascript
describe('Performance Test', () => {
  test('should handle load', async () => {
    const requests = Array(10).fill().map(() => 
      request(app).get('/status')
    );
    
    const responses = await Promise.all(requests);
    // Assert all responses are successful
  });
});
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Ensure MySQL is running
   - Check database credentials in `.env.test`
   - Verify test database exists

2. **Test Timeout Errors**
   - Increase Jest timeout in test files
   - Check database performance
   - Ensure test database is properly configured

3. **Port Conflicts**
   - Change `PORT` in `.env.test` if 3001 is in use
   - Ensure no other services are using the test port

### Debug Mode
Run tests with debug output:
```bash
DEBUG=* npm test
```

## Continuous Integration

The test suite is designed to work in CI environments:
- Tests use environment variables for configuration
- No external dependencies beyond MySQL
- Tests clean up after themselves
- Coverage reports are generated for CI integration
