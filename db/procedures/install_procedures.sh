#!/bin/bash

# Install User Stored Procedures
# This script installs all stored procedures for user management
# Usage: ./install_procedures.sh [username] [password]
# Default: username=root, password=(none)

# Parse command line arguments
USERNAME=${1:-root}
PASSWORD=${2:-""}

# Build MySQL connection string
if [ -z "$PASSWORD" ]; then
    MYSQL_CMD="mysql -u $USERNAME"
else
    MYSQL_CMD="mysql -u $USERNAME -p$PASSWORD"
fi

echo "Installing user stored procedures..."
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

# Change to the procedures directory
cd "$(dirname "$0")"

# Install stored procedures
echo "Installing all_stored_procedures.sql..."
$MYSQL_CMD users < all_stored_procedures.sql

echo "Verifying installation..."
$MYSQL_CMD users -e "SHOW PROCEDURE STATUS WHERE Db = 'users';"

echo "Installation complete!"
