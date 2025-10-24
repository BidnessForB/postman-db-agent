# Database Agent

A lightweight REST API for MySQL database access with stored procedure support.

## Overview

This project provides a REST API that acts as a database agent, allowing you to:
- Execute SQL queries via HTTP endpoints
- Call MySQL stored procedures
- Access your database from Postman or any HTTP client
- Manage users and addresses with pre-built stored procedures

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database (Choose one option)

#### Option A: Complete setup from scratch (Recommended)
```bash
# Make setup script executable
chmod +x db/setup_database.sh

# Run with default credentials (root, no password)
./db/setup_database.sh

# Run with custom credentials
./db/setup_database.sh myuser mypassword
```

#### Option B: Install stored procedures only (if database already exists)
```bash
# Make installation script executable
chmod +x db/procedures/install_procedures.sh

# Run with default credentials (root, no password)
./db/procedures/install_procedures.sh

# Run with custom credentials
./db/procedures/install_procedures.sh myuser mypassword
```

### 3. Start the Database Agent
```bash
node dbAgent.js
```

### 4. Test the API

#### Postman Collection
1. Import `Postman_Database_Agent_Collection.json` into Postman
2. Start with the **Status Check** request

The agent will start on `http://localhost:3000`

## API Endpoints

### Status Check
- **GET** `/status` - Check if the agent is running

### Database Queries
- **POST** `/api/query` - Execute custom SQL queries
- **POST** `/api/procedure` - Execute stored procedures


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
├── db/                     # Database files
│   ├── database_schema.sql # Complete database schema
│   ├── setup_database.sh   # Complete setup script
│   ├── procedures/         # Stored procedures directory
│   │   ├── all_stored_procedures.sql # All procedures in one file
│   │   └── install_procedures.sh # Installation script
│   └── README.md           # Database documentation
└── README.md               # This file
```

## Stored Procedures

The following stored procedures are available:

### User Creation
- `AddUser(firstname, lastname, email)` - Add user only
- `AddUserWithAddress(...)` - Add user with address

### User Updates
- `UpdateUser(userid, firstname, lastname, email)` - Update user only
- `UpdateUserAddress(...)` - Update user with address

### User Deletion
- `DeleteUser(userid)` - Delete user and address
- `DeleteUserAddress(userid)` - Delete address only

### User Queries
- `GetUserById(userid)` - Get user by ID with address
- `GetAllUsers()` - Get all users with addresses
- `SearchUsers(search_term)` - Search users by name/email

## Configuration

The database agent connects to:
- **Host**: localhost
- **User**: root
- **Database**: users
- **Port**: 3000 (API server)

To modify these settings, edit the connection configuration in `dbAgent.js`.

## Postman Integration

This agent is designed to work seamlessly with Postman. You can:
1. Import the API endpoints into Postman
2. Use the stored procedures for database operations
3. Test your database operations without direct MySQL access
4. Build automated tests for your database functionality

## Benefits

- ✅ **REST API Access** - Use HTTP instead of direct database connections
- ✅ **Postman Compatible** - Works in Postman sandbox environment
- ✅ **Stored Procedures** - Pre-built, optimized database operations
- ✅ **Error Handling** - Comprehensive error responses
- ✅ **Transaction Safety** - All operations are atomic
- ✅ **Lightweight** - Minimal dependencies and overhead
