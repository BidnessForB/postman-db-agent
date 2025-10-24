# Database Scripts Usage

This document explains how to use the database setup and installation scripts.

## Scripts Overview

- **`setup_database.sh`** - Complete database setup from scratch
- **`install_procedures.sh`** - Install stored procedures only

## Usage

### Basic Usage (Default Credentials)

Both scripts use `root` user with no password by default:

```bash
# Complete setup from scratch
./db/setup_database.sh

# Install procedures only
./db/procedures/install_procedures.sh
```

### Custom Credentials

You can specify custom MySQL username and password:

```bash
# Complete setup with custom credentials
./db/setup_database.sh myuser mypassword

# Install procedures with custom credentials
./db/install_procedures.sh myuser mypassword
```

### Examples

#### Example 1: Default Setup
```bash
# This will use root user with no password
./db/setup_database.sh
```

#### Example 2: Custom User
```bash
# This will use 'admin' user with no password
./db/setup_database.sh admin
```

#### Example 3: Custom User and Password
```bash
# This will use 'dbuser' with password 'secret123'
./db/setup_database.sh dbuser secret123
```

#### Example 4: Install Procedures Only
```bash
# Install procedures with default credentials
./db/procedures/install_procedures.sh

# Install procedures with custom credentials
./db/procedures/install_procedures.sh myuser mypassword
```

## What Each Script Does

### setup_database.sh
1. Tests database connection
2. Creates database and tables (`schema.sql`)
3. Installs all stored procedures
4. Adds sample data (`create_tables.sql`)
5. Verifies installation

### procedures/install_procedures.sh
1. Tests database connection
2. Installs all stored procedures
3. Verifies installation

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
