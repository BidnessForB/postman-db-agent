#!/bin/bash

# Install User Stored Procedures
# This script installs all stored procedures for user management

echo "Installing user stored procedures..."

# Check if MySQL is running
if ! pgrep -x "mysqld" > /dev/null; then
    echo "Error: MySQL is not running. Please start MySQL first."
    exit 1
fi

# Install stored procedures
echo "Installing sp_user.sql..."
mysql -u root -p users < db/sp_user.sql

echo "Installing sp_user_update.sql..."
mysql -u root -p users < db/sp_user_update.sql

echo "Installing sp_user_delete.sql..."
mysql -u root -p users < db/sp_user_delete.sql

echo "Installing sp_user_get.sql..."
mysql -u root -p users < db/sp_user_get.sql

echo "Verifying installation..."
mysql -u root -p users -e "SHOW PROCEDURE STATUS WHERE Db = 'users';"

echo "Installation complete!"
