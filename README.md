# Database Agent

A lightweight REST API for MySQL database access with stored procedure support.

## Overview

NOTE: Currently only works for mySQL databases via the [mysql2 driver package](https://www.npmjs.com/package/mysql2).  If useful this could be expanded to use any sql driver.  

This project provides a REST API that acts as a database agent, allowing you to:
- Execute SQL queries via HTTP endpoints 
- Call MySQL stored procedures
- Access your database from Postman or any HTTP client
- Use your own database or the included sample database

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
```bash
# Copy the example configuration file
cp .env.example .env

# Edit .env with your database settings
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=users
# DB_PORT=3306
```

### 3. Setup Database (Optional)

**Option A: Use your own database**
- Configure your existing database in the `.env` file
- Skip to step 4 to start the agent

**Option B: Use the included sample database (Recommended for testing)**

See [the Sample DB README.md](db/README.md) for details on the sample database setup.


### 4. Start the Database Agent
```bash
node dbAgent.js
```

### 5. Test the API in Postman
1. Import `postman/Postman_Database_Agent_Collection.json` into Postman
2. Start with the **Status Check** request
3. Try the sample queries or use your own database queries

NOTE: The collection includes complete documentation for each request.

The agent will start on `http://localhost:3000`

## API Endpoints

### Status Check
- **GET** `/status` - Check if the agent is running

### Database Queries
- **POST** `/api/query` - Execute custom SQL queries
- **POST** `/api/procedure` - Execute stored procedures

The colleciton contains additional documentation and examples.  


## Usage Examples

### Execute Custom SQL Query
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

## Project Structure

```
node-data/
├── dbAgent.js              # Main database agent server
├── package.json            # Dependencies
├── Postman_Database_Agent_Collection.json # Postman collection
├── postman/
│   └── postman-dbagent-package.js # Postman package module
├── db/                     # Database files
│   ├── database_schema.sql # Complete database schema
│   ├── setup_database.sh   # Complete setup script
│   ├── procedures/         # Stored procedures directory
│   │   ├── all_stored_procedures.sql # All procedures in one file
│   │   └── install_procedures.sh # Installation script
│   └── README.md           # Database documentation
└── README.md               # This file
```

## Postman Package Module

The `postman/postman-dbagent-package.js` file is designed to be imported or copy-pasted into a Postman package for easy database operations within Postman scripts.

### Purpose
This package provides utility functions that wrap the database agent API, making it easy to execute SQL queries and stored procedures directly from Postman test scripts without writing raw HTTP requests.

### Available Functions
- **`sendSQL(querySql)`** - Execute custom SQL queries
- **`execProcedure(procName, params)`** - Execute stored procedures

### Usage Examples
```javascript
// Execute a SQL query
const query = {
    "query": "SELECT * FROM user LIMIT 5",
    "params": []
};
const results = await sendSQL(query);

// Execute a stored procedure
const procResults = await execProcedure("GetAllUsers", []);
```

### Integration
The usage of this package is demonstrated in the `Postman_Database_Agent_Collection.json` collection, which includes:
- **Raw script examples** - Shows how to copy-paste the functions directly
- **Package import examples** - Shows how to use it as a Postman package
- **Complete test scenarios** - Demonstrates both SQL queries and stored procedure calls

### Benefits
- **Simplified API calls** - No need to write raw HTTP requests
- **Error handling** - Built-in error handling and response parsing
- **Reusable** - Can be used across multiple Postman collections

