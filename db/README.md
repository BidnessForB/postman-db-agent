# Sample Database Usage Guide

This document provides comprehensive guidance for using the optional sample database that comes with this project. **You can use your own database instead** - the API works with any MySQL database and stored procedures.

## Overview

The sample database is designed for testing and demonstration purposes. It includes:
- A user management system with two tables (`user` and `address`)
- Pre-built stored procedures for common operations
- Sample data for testing
- Complete setup and maintenance scripts

## Database Schema

The sample database includes two main tables designed for user management:

### Users Table
```sql
CREATE TABLE user (
    userid INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Addresses Table
```sql
CREATE TABLE address (
    addressid INT AUTO_INCREMENT PRIMARY KEY,
    userid INT NOT NULL,
    street VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(20) NOT NULL,
    zipcode VARCHAR(10) NOT NULL,
    country VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES user(userid) ON DELETE CASCADE
);
```

## Setup Options

### Option 1: Complete Sample Database Setup (Recommended for testing)

This creates the entire sample database from scratch:

```bash
# Make the setup script executable
chmod +x db/setup_database.sh

# Run with default MySQL credentials (root, no password) and default database name (users)
./db/setup_database.sh

# Run with custom credentials and default database name
./db/setup_database.sh myuser mypassword

# Run with custom credentials and custom database name
./db/setup_database.sh myuser mypassword my_custom_db
```

**What this script does:**
1. Tests database connection
2. Creates the database (default: `users`, or custom name if specified)
3. Creates both `user` and `address` tables
4. Installs all sample stored procedures
5. Sets up proper indexes and constraints
6. Adds sample data
7. Verifies installation

### Option 2: Sample Stored Procedures Only

If you already have a database with the sample schema, you can install just the stored procedures:

```bash
# Make the installation script executable
chmod +x db/procedures/install_procedures.sh

# Run with default credentials and default database name
./db/procedures/install_procedures.sh

# Run with custom credentials and default database name
./db/procedures/install_procedures.sh myuser mypassword

# Run with custom credentials and custom database name
./db/procedures/install_procedures.sh myuser mypassword my_custom_db
```

**What this script does:**
1. Tests database connection
2. Installs all sample stored procedures
3. Verifies installation

## Available Sample Stored Procedures

### User Creation Procedures

#### AddUser(firstname, lastname, email)
- Creates a new user record
- Returns the new user ID
- Example: `CALL AddUser('John', 'Doe', 'john@example.com')`

#### AddUserWithAddress(firstname, lastname, email, street, city, state, zipcode, country)
- Creates a user with their address in one transaction
- Returns the new user ID
- Example: `CALL AddUserWithAddress('Jane', 'Smith', 'jane@example.com', '123 Main St', 'Boston', 'MA', '02101', 'USA')`

### User Update Procedures

#### UpdateUser(userid, firstname, lastname, email)
- Updates user information
- Returns number of affected rows
- Example: `CALL UpdateUser(1, 'John', 'Updated', 'john.updated@example.com')`

#### UpdateUserAddress(userid, firstname, lastname, email, street, city, state, zipcode, country)
- Updates both user and address information
- Returns number of affected rows
- Example: `CALL UpdateUserAddress(1, 'John', 'Updated', 'john@example.com', '456 New St', 'New York', 'NY', '10001', 'USA')`

### User Deletion Procedures

#### DeleteUser(userid)
- Deletes user and all associated addresses (CASCADE)
- Returns number of affected rows
- Example: `CALL DeleteUser(1)`

#### DeleteUserAddress(userid)
- Deletes only the address for a user
- Returns number of affected rows
- Example: `CALL DeleteUserAddress(1)`

### User Query Procedures

#### GetUserById(userid)
- Returns user information with address
- Example: `CALL GetUserById(1)`

#### GetAllUsers()
- Returns all users with their addresses
- Example: `CALL GetAllUsers()`

#### SearchUsers(search_term)
- Searches users by first name, last name, or email
- Case-insensitive search
- Example: `CALL SearchUsers('john')`

## Sample Data

You can populate the sample database with test data using these SQL queries:

```sql
-- Insert sample users
INSERT INTO user (firstname, lastname, email) VALUES
('John', 'Doe', 'john.doe@example.com'),
('Jane', 'Smith', 'jane.smith@example.com'),
('Bob', 'Johnson', 'bob.johnson@example.com');

-- Insert sample addresses
INSERT INTO address (userid, street, city, state, zipcode, country) VALUES
(1, '123 Main St', 'Boston', 'MA', '02101', 'USA'),
(2, '456 Oak Ave', 'New York', 'NY', '10001', 'USA'),
(3, '789 Pine Rd', 'Los Angeles', 'CA', '90210', 'USA');
```

## Configuration

### Environment Variables for Sample Database
```bash
# Database connection settings
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=users
DB_PORT=3306
DB_CONNECTION_LIMIT=10
```

### Sample Database Requirements
- **MySQL 5.7+** or **MySQL 8.0+**
- **InnoDB storage engine** (default)
- **UTF-8 character set** (utf8mb4 recommended)
- **Sufficient privileges** to create databases, tables, and procedures

## File Structure

### Core Sample Files
- **`db/database_schema.sql`** - Complete sample database schema with tables, indexes, and constraints
- **`db/setup_database.sh`** - Automated setup script for complete sample database installation

### Sample Stored Procedures
- **`db/procedures/all_stored_procedures.sql`** - All sample stored procedures in a single file
- **`db/procedures/install_procedures.sh`** - Script to install only the sample stored procedures
- **`db/procedures/README.md`** - Detailed documentation for each sample stored procedure

## Script Parameters

Both scripts accept three parameters:

### setup_database.sh
```bash
./db/setup_database.sh [username] [password] [database_name]
```

### install_procedures.sh
```bash
./db/procedures/install_procedures.sh [username] [password] [database_name]
```

| Parameter | Default | Description |
|----------|---------|-------------|
| `username` | `root` | MySQL username |
| `password` | `(empty)` | MySQL password |
| `database_name` | `users` | Database name to create |

## Usage Examples

### Basic Usage (Default Credentials)

Both scripts use `root` user with no password by default:

```bash
# Complete setup from scratch (uses default database name 'users')
./db/setup_database.sh

# Complete setup with custom database name
./db/setup_database.sh root "" my_custom_db

# Install procedures only
./db/procedures/install_procedures.sh
```

### Custom Credentials

You can specify custom MySQL username and password:

```bash
# Complete setup with custom credentials (uses default database name 'users')
./db/setup_database.sh myuser mypassword

# Complete setup with custom credentials and custom database name
./db/setup_database.sh myuser mypassword my_custom_db

# Install procedures with custom credentials and default database name
./db/procedures/install_procedures.sh myuser mypassword

# Install procedures with custom credentials and custom database name
./db/procedures/install_procedures.sh myuser mypassword my_custom_db
```

### Examples

#### Example 1: Default Setup
```bash
# This will use root user with no password and default database name 'users'
./db/setup_database.sh
```

#### Example 2: Custom User
```bash
# This will use 'admin' user with no password and default database name 'users'
./db/setup_database.sh admin
```

#### Example 3: Custom User and Password
```bash
# This will use 'dbuser' with password 'secret123' and default database name 'users'
./db/setup_database.sh dbuser secret123
```

#### Example 4: Custom Database Name
```bash
# This will use root user with no password and custom database name 'my_test_db'
./db/setup_database.sh root "" my_test_db

# This will use custom user, password, and database name
./db/setup_database.sh dbuser secret123 my_test_db
```

#### Example 5: Install Procedures Only
```bash
# Install procedures with default credentials and default database name
./db/procedures/install_procedures.sh

# Install procedures with custom credentials and default database name
./db/procedures/install_procedures.sh myuser mypassword

# Install procedures with custom credentials and custom database name
./db/procedures/install_procedures.sh myuser mypassword my_custom_db
```

## Error Handling

The scripts include comprehensive error handling:

- **MySQL not running**: Script exits with error message
- **Invalid credentials**: Script tests connection and exits if failed
- **File not found**: Script will show which files are missing
- **Procedure already exists**: Script continues (procedures are updated)

## Output

Both scripts provide detailed output showing:
- Which user is being used
- Password status (shows "(none)" for empty passwords)
- Connection test results
- Installation progress
- Verification results

## Troubleshooting

### Common Problems

1. **Permission Denied**
   ```bash
   # Grant necessary privileges
   GRANT ALL PRIVILEGES ON *.* TO 'your_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

2. **Database Already Exists**
   ```bash
   # Drop and recreate (WARNING: This will delete all data)
   mysql -u root -p -e "DROP DATABASE IF EXISTS users;"
   ./db/setup_database.sh
   ```

3. **Stored Procedure Errors**
   ```bash
   # Check if procedures exist
   mysql -u root -p -e "SHOW PROCEDURE STATUS WHERE Db = 'users';"
   
   # Reinstall procedures (use your database name)
   ./db/procedures/install_procedures.sh root "" your_database_name
   ```

### Connection Issues
```bash
# Test MySQL connection manually
mysql -u root -e "SELECT 1;"

# Test with custom credentials
mysql -u myuser -p -e "SELECT 1;"
```

### Permission Issues
```bash
# Make scripts executable
chmod +x db/setup_database.sh
chmod +x db/procedures/install_procedures.sh
```

### File Path Issues
Make sure you run the scripts from the project root directory:
```bash
# Correct location
/Users/yourname/project/node-data$ ./db/setup_database.sh
/Users/yourname/project/node-data$ ./db/procedures/install_procedures.sh

# Wrong location
/Users/yourname/project/node-data/db$ ./setup_database.sh
/Users/yourname/project/node-data/db/procedures$ ./install_procedures.sh
```

## Database Maintenance

### Backup Sample Database
```bash
# Create backup
mysqldump -u root -p users > users_backup.sql

# Restore backup
mysql -u root -p users < users_backup.sql
```

### Reset Sample Database
```bash
# Complete reset (WARNING: Deletes all data)
mysql -u root -p -e "DROP DATABASE IF EXISTS users;"
./db/setup_database.sh
```

## Integration with Database Agent

Once the sample database is set up, you can use it with the Database Agent API:

### Test the API
```bash
# Start the database agent
node dbAgent.js

# Test with Postman collection
# Import Postman_Database_Agent_Collection.json
```

### Example API Calls
```bash
# Get all users
curl -X POST http://localhost:3000/api/procedure \
  -H "Content-Type: application/json" \
  -d '{"procedure": "GetAllUsers", "params": []}'

# Add a new user
curl -X POST http://localhost:3000/api/procedure \
  -H "Content-Type: application/json" \
  -d '{"procedure": "AddUser", "params": ["John", "Doe", "john@example.com"]}'
```

## Additional Documentation

For detailed information about the sample database schema, stored procedures, and their parameters, see:
- **`db/README.md`** - Sample database overview and setup instructions
- **`db/procedures/README.md`** - Detailed sample stored procedure documentation

## Notes

- **This is a sample database** - You can use your own database instead
- **The API is database-agnostic** - Works with any MySQL database and stored procedures
- **Sample procedures are examples** - You can create your own stored procedures
- **Perfect for testing** - Provides a complete working example for development and testing