# Database Agent API Collection

## Overview

This collection provides comprehensive testing for the Node.js Database Agent API, a lightweight REST API for MySQL database access with stored procedure support. The agent allows you to execute SQL queries and stored procedures via HTTP endpoints, making it perfect for Postman testing and integration.

The requests and other assets are set up for use with the sample database, but you can use any database you like. See the [dbAgent documentation](https://github.com/BidnessForB/postman-db-agent/blob/main/README.md) to set up your agent.

## Use Cases

 - Setup initial test data
 - Cleanup DBs after test runs
 - Retrieve data for use in validating that requests/collection runs created the correct data in the DB

## Prerequisites

### 1. Database Agent Setup
- Ensure the Database Agent is running on `http://localhost:3000`
- Database must be configured and accessible
- For testing with sample data, use the included sample database setup

### 2. Database Configuration
- **Default Database**: `users` (or your custom database name)
- **Required Tables**: [`user` and `address` (if using sample database)](https://github.com/BidnessForB/postman-db-agent/blob/main/db/README.md)
- **Stored Procedures**: 8 sample procedures available (if using sample database)

### 3. Environment Variables
Create a `.env` file with your database configuration:
```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=users
DB_PORT=3306
```

## Collection Structure

### 🏥 Health Check
- **Health Check** - Verify the Database Agent is running and responsive

### 🔍 Custom SQL Queries
- **Execute Custom SQL** - Run any SQL query with optional parameters
- **Execute SQL with Parameters** - Parameterized queries for security

### 📊 Stored Procedures
- **Execute Stored Procedure** - Call MySQL stored procedures with parameters
  - Sample procedures: `GetAllUsers`, `GetUserById`, `AddUser`, `AddUserWithAddress`, etc.

### ❌ Error Testing
- **Test Invalid SQL** - Verify error handling for malformed SQL
- **Test Invalid Procedure** - Test non-existent stored procedures
- **Test Missing Procedure Name** - Validate required parameter handling

### 🛠️ Scripted Examples
- **Raw script** - Direct implementation of database functions
- **As package** - Using the Postman package module

## API Endpoints

### Health Check
- **GET** `/health` - Check if the agent is running
- **Response**: Status, message, and timestamp

### Database Operations
- **POST** `/api/query` - Execute custom SQL queries
  - **Body**: `{"query": "SELECT * FROM user", "params": []}`
- **POST** `/api/procedure` - Execute stored procedures
  - **Body**: `{"procedure": "GetAllUsers", "params": []}`

## Sample Database (Optional)

If using the included sample database, the following stored procedures are available:

### User Management Procedures
- **`AddUser(firstname, lastname, email)`** - Create new user
- **`AddUserWithAddress(...)`** - Create user with address
- **`UpdateUser(userid, firstname, lastname, email)`** - Update user
- **`UpdateUserAddress(...)`** - Update user and address
- **`DeleteUser(userid)`** - Delete user and address
- **`DeleteUserAddress(userid)`** - Delete address only

### Query Procedures
- **`GetUserById(userid)`** - Get user by ID with address
- **`GetAllUsers()`** - Get all users with addresses
- **`SearchUsers(search_term)`** - Search users by name/email

## Usage Examples

### Basic Health Check
```bash
curl -X GET http://localhost:3000/health
```

### Execute SQL Query
```bash
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT * FROM user LIMIT 5", "params": []}'
```

### Execute Stored Procedure
```bash
curl -X POST http://localhost:3000/api/procedure \
  -H "Content-Type: application/json" \
  -d '{"procedure": "GetAllUsers", "params": []}'
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": [...],
  "count": 5
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## Testing Workflow

### 1. Start with Health Check
- Verify the agent is running
- Check response time and status

### 2. Test Basic Queries
- Execute simple SELECT queries
- Test parameterized queries
- Verify data retrieval

### 3. Test Stored Procedures
- Call sample procedures (if using sample database)
- Test with different parameters
- Verify complex operations

### 4. Error Handling
- Test invalid SQL syntax
- Test non-existent procedures
- Verify error responses

### 5. Performance Testing
- Test with large result sets
- Monitor response times
- Check connection handling

## Environment Variables

The collection uses these variables:
- **`base_url`** - API base URL (default: `http://localhost:3000`)
- **`queryResults`** - Store query results
- **`procResults`** - Store procedure results

## Scripted Testing

### Raw Script Implementation
The collection includes direct implementations of:
- `sendSQL(querySql)` - Execute SQL queries
- `execProcedure(procName, params)` - Execute stored procedures

### Package Module Usage
For advanced testing, use the included Postman package:
```javascript
const { sendSQL, execProcedure } = pm.require('@brkc-personal/get-custom-sql');
```

## Best Practices

### Security
- Use parameterized queries to prevent SQL injection
- Validate input parameters
- Test error conditions thoroughly

### Performance
- Limit result sets with appropriate WHERE clauses
- Use indexes for better query performance
- Monitor response times

### Testing
- Test both success and error scenarios
- Verify data integrity
- Test with different data types and sizes

## Troubleshooting

### Common Issues
1. **Connection Refused** - Database Agent not running
2. **Database Error** - Invalid database configuration
3. **Procedure Not Found** - Stored procedures not installed

### Debug Steps
1. Check Database Agent status with Health Check
2. Verify database connection in `.env` file
3. Test with simple SQL queries first
4. Check stored procedure installation

## Integration

This collection is designed to work with:
- **Postman Runner** - Automated testing
- **Newman** - Command-line testing
- **CI/CD Pipelines** - Continuous integration
- **API Documentation** - Generate docs from collection

## Support

For issues or questions:
- Check the project README.md
- Review database setup documentation
- Test with sample database first
- Verify all prerequisites are met

---

**Note**: This collection is designed to work with the Node.js Database Agent. Ensure the agent is properly configured and running before executing tests.
