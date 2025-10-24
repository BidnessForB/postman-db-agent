
-- =============================================
-- Stored Procedure: GetUserById
-- Description: Gets a user by ID with their address
-- Parameters: userid
-- Returns: user data with address
-- =============================================

DELIMITER //

CREATE PROCEDURE GetUserById(
    IN p_userid INT
)
BEGIN
    SELECT 
        u.userid,
        u.firstname,
        u.lastname,
        u.email,
        u.created_at,
        a.addressid,
        a.street,
        a.city,
        a.state,
        a.zipcode,
        a.country
    FROM user u
    LEFT JOIN address a ON u.userid = a.userid
    WHERE u.userid = p_userid;
    
END //

-- =============================================
-- Stored Procedure: GetAllUsers
-- Description: Gets all users with their addresses
-- Parameters: none
-- Returns: all users with addresses
-- =============================================

CREATE PROCEDURE GetAllUsers()
BEGIN
    SELECT 
        u.userid,
        u.firstname,
        u.lastname,
        u.email,
        u.created_at,
        a.addressid,
        a.street,
        a.city,
        a.state,
        a.zipcode,
        a.country
    FROM user u
    LEFT JOIN address a ON u.userid = a.userid
    ORDER BY u.userid;
    
END //

-- =============================================
-- Stored Procedure: SearchUsers
-- Description: Searches users by name
-- Parameters: search_term
-- Returns: matching users with addresses
-- =============================================

CREATE PROCEDURE SearchUsers(
    IN p_search_term VARCHAR(100)
)
BEGIN
    SELECT 
        u.userid,
        u.firstname,
        u.lastname,
        u.email,
        u.created_at,
        a.addressid,
        a.street,
        a.city,
        a.state,
        a.zipcode,
        a.country
    FROM user u
    LEFT JOIN address a ON u.userid = a.userid
    WHERE u.firstname LIKE CONCAT('%', p_search_term, '%')
       OR u.lastname LIKE CONCAT('%', p_search_term, '%')
       OR u.email LIKE CONCAT('%', p_search_term, '%')
    ORDER BY u.userid;
    
END //

DELIMITER ;

-- =============================================
-- Usage Examples:
-- =============================================

-- Get user by ID:
-- CALL GetUserById(1);

-- Get all users:
-- CALL GetAllUsers();

-- Search users:
-- CALL SearchUsers('John');
