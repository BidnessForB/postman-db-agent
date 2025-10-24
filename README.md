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

### 3. Setup Database (Choose one option)

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

### 4. Start the Database Agent
```bash
node dbAgent.js
```

### 5. Test the API

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
├── .vscode/
│   └── dbAgent-postman-package.js # Postman package module
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

The database agent uses environment variables for configuration. Create a `.env` file from the example:

```bash
cp env.example .env
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | localhost | Database host |
| `DB_USER` | root | Database username |
| `DB_PASSWORD` | (empty) | Database password |
| `DB_NAME` | users | Database name |
| `DB_PORT` | 3306 | Database port |
| `DB_CONNECTION_LIMIT` | 10 | Connection pool limit |
| `PORT` | 3000 | API server port |

To modify these settings, edit your `.env` file.

## Postman Integration

This agent is designed to work seamlessly with Postman. You can:
1. Import the API endpoints into Postman
2. Use the stored procedures for database operations
3. Test your database operations without direct MySQL access
4. Build automated tests for your database functionality

### Postman Package Module

The project includes `dbAgent-postman-package.js` - a set of utility functions that wrap the database agent API, making it easy to use in Postman scripts:

- **`sendSQL(querySql)`** - Execute custom SQL queries
- **`execProcedure(procName, params)`** - Execute stored procedures

These functions handle HTTP requests to the database agent endpoints and provide a clean interface for database operations within Postman scripts. The package is ready to be imported into the Postman package manager for easy reuse across collections.

## Benefits

- ✅ **REST API Access** - Use HTTP instead of direct database connections
- ✅ **Postman Compatible** - Works in Postman sandbox environment
- ✅ **Stored Procedures** - Pre-built, optimized database operations
- ✅ **Error Handling** - Comprehensive error responses
- ✅ **Transaction Safety** - All operations are atomic
- ✅ **Lightweight** - Minimal dependencies and overhead
