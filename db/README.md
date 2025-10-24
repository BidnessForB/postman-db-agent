# Database Stored Procedures

This directory contains MySQL stored procedures for user and address management.

## Files

- **`sp_user.sql`** - Create user procedures (AddUser, AddUserWithAddress)
- **`sp_user_update.sql`** - Update user procedures (UpdateUser, UpdateUserAddress)
- **`sp_user_delete.sql`** - Delete user procedures (DeleteUser, DeleteUserAddress)
- **`sp_user_get.sql`** - Get user procedures (GetUserById, GetAllUsers, SearchUsers)

## Installation

Execute the stored procedures in your MySQL database:

```bash
# Connect to MySQL
mysql -u root -p

# Select your database
USE users;

# Execute each file
SOURCE db/sp_user.sql;
SOURCE db/sp_user_update.sql;
SOURCE db/sp_user_delete.sql;
SOURCE db/sp_user_get.sql;
```

Or execute all at once:
```bash
mysql -u root -p users < db/sp_user.sql
mysql -u root -p users < db/sp_user_update.sql
mysql -u root -p users < db/sp_user_delete.sql
mysql -u root -p users < db/sp_user_get.sql
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
