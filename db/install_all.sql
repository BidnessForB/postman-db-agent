-- =============================================
-- Install All Stored Procedures
-- Execute this file to install all user stored procedures
-- =============================================

-- Install user creation procedures
SOURCE sp_user.sql;

-- Install user update procedures  
SOURCE sp_user_update.sql;

-- Install user delete procedures
SOURCE sp_user_delete.sql;

-- Install user get procedures
SOURCE sp_user_get.sql;

-- Verify installation
SHOW PROCEDURE STATUS WHERE Db = 'users';
