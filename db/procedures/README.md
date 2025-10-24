# Database Stored Procedures

This directory contains MySQL stored procedures for user and address management.

## Files

### Database Schema
- **`database_schema.sql`** - Complete database schema with sample data
- **`setup_database.sh`** - Complete database setup from scratch

### Stored Procedures (in `procedures/` directory)
- **`procedures/sp_user.sql`** - Create user procedures (AddUser, AddUserWithAddress)
- **`procedures/sp_user_update.sql`** - Update user procedures (UpdateUser, UpdateUserAddress)
- **`procedures/sp_user_delete.sql`** - Delete user procedures (DeleteUser, DeleteUserAddress)
- **`procedures/sp_user_get.sql`** - Get user procedures (GetUserById, GetAllUsers, SearchUsers)
- **`procedures/install_procedures.sh`** - Installation script for all procedures

## Installation

### Option 1: Complete setup from scratch (Recommended)
```bash
# Make script executable
chmod +x db/setup_database.sh

# Run with default credentials (root, no password)
./db/setup_database.sh

# Run with custom credentials
./db/setup_database.sh myuser mypassword
```

### Option 2: Install stored procedures only
```bash
# Make script executable
chmod +x db/procedures/install_procedures.sh

# Run with default credentials (root, no password)
./db/procedures/install_procedures.sh

# Run with custom credentials
./db/procedures/install_procedures.sh myuser mypassword
```

### Option 3: Manual installation
```bash
# Execute each file individually
mysql -u root users < db/procedures/sp_user.sql
mysql -u root users < db/procedures/sp_user_update.sql
mysql -u root users < db/procedures/sp_user_delete.sql
mysql -u root users < db/procedures/sp_user_get.sql
```

### Option 4: Interactive MySQL session
```bash
# Connect to MySQL
mysql -u root

# Select your database
USE users;

# Execute each file
SOURCE db/procedures/sp_user.sql;
SOURCE db/procedures/sp_user_update.sql;
SOURCE db/procedures/sp_user_delete.sql;
SOURCE db/procedures/sp_user_get.sql;
```

## Usage Examples

### Create Users
```sql
-- Add user only
CALL AddUser('Jane', 'Doe', 'jane.doe@email.com');

-- Add user with address
CALL AddUserWithAddress(
    'Jane', 
    'Doe', 
    'jane.doe@email.com',
    '789 Oak Street',
    'Boston',
    'MA',
    '02101',
    'USA'
);
```

### Update Users
```sql
-- Update user only
CALL UpdateUser(1, 'John', 'Smith', 'john.smith@newemail.com');

-- Update user with address
CALL UpdateUserAddress(
    1,
    'John', 
    'Smith', 
    'john.smith@newemail.com',
    '456 New Street',
    'New York',
    'NY',
    '10002',
    'USA'
);
```

### Get Users
```sql
-- Get user by ID
CALL GetUserById(1);

-- Get all users
CALL GetAllUsers();

-- Search users
CALL SearchUsers('John');
```

### Delete Users
```sql
-- Delete user and address
CALL DeleteUser(1);

-- Delete only address
CALL DeleteUserAddress(1);
```

## Integration with Database Agent

You can call these stored procedures through the database agent:

```javascript
// POST http://localhost:3000/api/query
{
  "sql": "CALL AddUser(?, ?, ?)",
  "params": ["Jane", "Doe", "jane.doe@email.com"]
}
```

## Benefits

- ✅ **Transaction Safety** - All operations are atomic
- ✅ **Error Handling** - Automatic rollback on errors
- ✅ **Performance** - Pre-compiled and optimized
- ✅ **Reusability** - Can be called multiple times
- ✅ **Security** - Parameterized queries prevent SQL injection
