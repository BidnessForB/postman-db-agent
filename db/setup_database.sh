#!/bin/bash

# =============================================
# Database Setup Script
# Description: Complete database setup from scratch
# Usage: ./setup_database.sh [username] [password]
# Default: username=root, password=(none)
# =============================================

# Parse command line arguments
USERNAME=${1:-root}
PASSWORD=${2:-""}

# Build MySQL connection string
if [ -z "$PASSWORD" ]; then
    MYSQL_CMD="mysql -u $USERNAME"
else
    MYSQL_CMD="mysql -u $USERNAME -p$PASSWORD"
fi

echo "Setting up database from scratch..."
echo "Using MySQL user: $USERNAME"
echo "Password: ${PASSWORD:-'(none)'}"

# Check if MySQL is running
if ! pgrep -x "mysqld" > /dev/null; then
    echo "Error: MySQL is not running. Please start MySQL first."
    exit 1
fi

# Test database connection
echo "Testing database connection..."
if ! $MYSQL_CMD -e "SELECT 1;" > /dev/null 2>&1; then
    echo "Error: Cannot connect to MySQL with user '$USERNAME'"
    echo "Please check your credentials and try again."
    exit 1
fi

echo "Step 1: Creating database, tables, and sample data..."
$MYSQL_CMD < db/database_schema.sql

echo "Step 2: Installing stored procedures..."
$MYSQL_CMD users < db/procedures/sp_user.sql
$MYSQL_CMD users < db/procedures/sp_user_update.sql
$MYSQL_CMD users < db/procedures/sp_user_delete.sql
$MYSQL_CMD users < db/procedures/sp_user_get.sql

echo "Step 3: Verifying installation..."
echo "Database tables:"
$MYSQL_CMD users -e "SHOW TABLES;"

echo ""
echo "Stored procedures:"
$MYSQL_CMD users -e "SHOW PROCEDURE STATUS WHERE Db = 'users';"

echo ""
echo "Sample data:"
$MYSQL_CMD users -e "SELECT COUNT(*) as user_count FROM user;"
$MYSQL_CMD users -e "SELECT COUNT(*) as address_count FROM address;"

echo ""
echo "Database setup complete!"
echo "You can now start the database agent with: node dbAgent.js"
