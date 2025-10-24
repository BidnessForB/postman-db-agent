#!/bin/bash

# =============================================
# Database Setup Script
# Description: Complete database setup from scratch
# Usage: ./setup_database.sh [username] [password] [database_name]
#        OR run interactively without parameters
# Default: username=root, password=(none), database_name=users
# =============================================

# Check if running interactively (no parameters provided)
if [ $# -eq 0 ]; then
    echo "=== Interactive Database Setup ==="
    echo ""
    
    # Get username
    read -p "Enter MySQL username [root]: " USERNAME
    USERNAME=${USERNAME:-root}
    
    # Get password
    read -s -p "Enter MySQL password (press Enter for none): " PASSWORD
    echo ""
    
    # Get database name
    read -p "Enter database name [users]: " DATABASE_NAME
    DATABASE_NAME=${DATABASE_NAME:-users}
    
    echo ""
    echo "=== Setup Configuration ==="
    echo "Username: $USERNAME"
    echo "Password: ${PASSWORD:-'(none)'}"
    echo "Database: $DATABASE_NAME"
    echo ""
    
    read -p "Continue with setup? (y/N): " CONFIRM
    if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
    echo ""
else
    # Parse command line arguments (non-interactive mode)
    USERNAME=${1:-root}
    PASSWORD=${2:-""}
    DATABASE_NAME=${3:-users}
fi

# Build MySQL connection string
if [ -z "$PASSWORD" ]; then
    MYSQL_CMD="mysql -u $USERNAME"
else
    MYSQL_CMD="mysql -u $USERNAME -p$PASSWORD"
fi

echo "Setting up database from scratch..."
echo "Using MySQL user: $USERNAME"
echo "Password: ${PASSWORD:-'(none)'}"
echo "Database name: $DATABASE_NAME"

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
# Create a temporary file with the database name replaced
sed "s/{{DATABASE_NAME}}/$DATABASE_NAME/g" db/database_schema.sql > /tmp/database_schema_temp.sql
$MYSQL_CMD < /tmp/database_schema_temp.sql
rm /tmp/database_schema_temp.sql

echo "Step 2: Installing stored procedures..."
# Use the install_procedures.sh script with the database name parameter
if [ -z "$PASSWORD" ]; then
    ./db/procedures/install_procedures.sh $USERNAME "" $DATABASE_NAME
else
    ./db/procedures/install_procedures.sh $USERNAME $PASSWORD $DATABASE_NAME
fi

echo "Step 3: Verifying installation..."
echo "Database tables:"
$MYSQL_CMD $DATABASE_NAME -e "SHOW TABLES;"

echo ""
echo "Stored procedures:"
$MYSQL_CMD $DATABASE_NAME -e "SHOW PROCEDURE STATUS WHERE Db = '$DATABASE_NAME';"

echo ""
echo "Sample data:"
$MYSQL_CMD $DATABASE_NAME -e "SELECT COUNT(*) as user_count FROM user;"
$MYSQL_CMD $DATABASE_NAME -e "SELECT COUNT(*) as address_count FROM address;"

echo ""
echo "Database setup complete!"
echo "You can now start the database agent with: node dbAgent.js"
