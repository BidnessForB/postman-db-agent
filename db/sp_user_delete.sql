-- =============================================
-- Stored Procedure: DeleteUser
-- Description: Deletes a user and their address
-- Parameters: userid
-- Returns: affected_rows
-- =============================================

DELIMITER //

CREATE PROCEDURE DeleteUser(
    IN p_userid INT
)
BEGIN
    DECLARE v_affected_rows INT DEFAULT 0;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Delete the address first (foreign key constraint)
    DELETE FROM address WHERE userid = p_userid;
    SET v_affected_rows = v_affected_rows + ROW_COUNT();
    
    -- Delete the user
    DELETE FROM user WHERE userid = p_userid;
    SET v_affected_rows = v_affected_rows + ROW_COUNT();
    
    COMMIT;
    
    -- Return the number of affected rows
    SELECT v_affected_rows AS affected_rows;
    
END //

-- =============================================
-- Stored Procedure: DeleteUserAddress
-- Description: Deletes only the address for a user
-- Parameters: userid
-- Returns: affected_rows
-- =============================================

CREATE PROCEDURE DeleteUserAddress(
    IN p_userid INT
)
BEGIN
    DECLARE v_affected_rows INT DEFAULT 0;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Delete the address
    DELETE FROM address WHERE userid = p_userid;
    SET v_affected_rows = ROW_COUNT();
    
    COMMIT;
    
    -- Return the number of affected rows
    SELECT v_affected_rows AS affected_rows;
    
END //

DELIMITER ;

-- =============================================
-- Usage Examples:
-- =============================================

-- Delete user and their address:
-- CALL DeleteUser(1);

-- Delete only the address:
-- CALL DeleteUserAddress(1);
