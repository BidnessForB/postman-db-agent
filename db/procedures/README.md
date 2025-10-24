# Database Stored Procedures

This directory contains MySQL stored procedures for user and address management.

## Files

### Database Schema
- **`database_schema.sql`** - Complete database schema with sample data
- **`setup_database.sh`** - Complete database setup from scratch

### Stored Procedures
- **`all_stored_procedures.sql`** - **NEW**: All stored procedures in a single file
- **`install_procedures.sh`** - Installation script for all procedures

### Legacy Files (Deprecated)
- **`sp_user.sql`** - Create user procedures (AddUser, AddUserWithAddress) - **DEPRECATED**
- **`sp_user_update.sql`** - Update user procedures (UpdateUser, UpdateUserAddress) - **DEPRECATED**
- **`sp_user_delete.sql`** - Delete user procedures (DeleteUser, DeleteUserAddress) - **DEPRECATED**
- **`sp_user_get.sql`** - Get user procedures (GetUserById, GetAllUsers, SearchUsers) - **DEPRECATED**

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

### Option 3: Manual installation (NEW - Single File)
```bash
# Execute the consolidated file
mysql -u root users < db/procedures/all_stored_procedures.sql

# Or with custom credentials
mysql -u myuser -p users < db/procedures/all_stored_procedures.sql
```

### Option 4: Interactive MySQL session (NEW - Single File)
```bash
# Connect to MySQL
mysql -u root

# Select your database
USE users;

# Execute the consolidated file
SOURCE db/procedures/all_stored_procedures.sql;
```

### Option 5: Legacy installation (DEPRECATED)
```bash
# Execute each individual file (deprecated - use all_stored_procedures.sql instead)
mysql -u root users < db/procedures/sp_user.sql
mysql -u root users < db/procedures/sp_user_update.sql
mysql -u root users < db/procedures/sp_user_delete.sql
mysql -u root users < db/procedures/sp_user_get.sql
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
