#!/bin/bash

# Install User Stored Procedures
# This script installs all stored procedures for user management
# Usage: ./install_procedures.sh [username] [password] [database_name]
# Default: username=root, password=(none), database_name=users

# Parse command line arguments
USERNAME=${1:-root}
PASSWORD=${2:-""}
DATABASE_NAME=${3:-users}

# Build MySQL connection string
if [ -z "$PASSWORD" ]; then
    MYSQL_CMD="mysql -u $USERNAME"
else
    MYSQL_CMD="mysql -u $USERNAME -p$PASSWORD"
fi

echo "Installing user stored procedures..."
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

# Change to the procedures directory
cd "$(dirname "$0")"

# Install stored procedures
echo "Installing all_stored_procedures.sql..."
$MYSQL_CMD $DATABASE_NAME < all_stored_procedures.sql

echo "Verifying installation..."
$MYSQL_CMD $DATABASE_NAME -e "SHOW PROCEDURE STATUS WHERE Db = '$DATABASE_NAME';"

echo "Installation complete!"
