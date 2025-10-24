/**
 * Database Agent Postman Package
 * 
 * This package provides utility functions to interact with the database agent
 * from within Postman scripts. It encapsulates the HTTP requests to the
 * database agent API endpoints.
 * 
 * Prerequisites:
 * - Database agent must be running on http://localhost:3000
 * - Database must be set up with the required schema and stored procedures
 * 
 * Available Functions:
 * - sendSQL(querySql) - Execute custom SQL queries
 * - execProcedure(procName, params) - Execute stored procedures
 * 
 * @author Database Agent Team
 * @version 1.0.0
 */

/**
 * Sends a SQL query to the database agent
 * 
 * @param {Object} querySql - The SQL query object
 * @param {string} querySql.query - The SQL query string
 * @param {Array} querySql.params - Array of parameters for the query (optional)
 * 
 * @returns {Promise<Object>} Promise that resolves with the query results
 * 
 * @example
 * // Simple SELECT query
 * const query = {
 *     "query": "SELECT * FROM user LIMIT 5",
 *     "params": []
 * };
 * const results = await sendSQL(query);
 * 
 * @example
 * // Parameterized query
 * const query = {
 *     "query": "SELECT * FROM user WHERE userid = ?",
 *     "params": [1]
 * };
 * const results = await sendSQL(query);
 */
function sendSQL(querySql) {

    const request = {
        url: "http://localhost:3000/api/query",
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: {
            mode: "raw",
            raw: JSON.stringify(
                querySql


            )
        }
    }



    return new Promise((resolve, reject) => {
        try {
            pm.sendRequest(request, (error, response) => {
                if (error) { //dbAgent not running, probably
                    //console.log('sendSQL request error:', error.message);
                    reject(error);
                }
                else {

                    try {
                        response.json();

                    } catch (parseErr) {
                        //console.log('sendSQL response parse error:', parseErr);
                        reject(parseErr);
                    }
                    if (response?.code && response.code !== 200) {
                        //console.log('sendSQL non-OK status:', response.json());
                        reject('Request failed with status ' + response.code + ' ' + JSON.stringify(response.json()));
                    }
                    else if (response?.code === 200 && !response.success === 'true') {
                        //console.log("SQL error: ", response.json());
                        reject(response.json());
                    }
                    else {
                        //console.log("All good")
                        resolve(response.json());
                    }
                }

            });
        } catch (err) {
            //console.log.log('sendSQL unexpected error:', err);
            reject('Unexpected error' + err.message);
        }

    });

}

/**
 * Executes a stored procedure through the database agent
 * 
 * @param {string} procName - The name of the stored procedure to execute
 * @param {Array} params - Array of parameters to pass to the stored procedure
 * 
 * @returns {Promise<Object>} Promise that resolves with the procedure results
 * 
 * @example
 * // Get all users
 * const results = await execProcedure("GetAllUsers", []);
 * 
 * @example
 * // Get user by ID
 * const results = await execProcedure("GetUserById", [1]);
 * 
 * @example
 * // Add a new user
 * const results = await execProcedure("AddUser", ["John", "Doe", "john.doe@email.com"]);
 * 
 * @example
 * // Update user with address
 * const results = await execProcedure("UpdateUserAddress", [
 *     1, "John", "Smith", "john.smith@email.com",
 *     "123 Main St", "New York", "NY", "10001", "USA"
 * ]);
 */
function execProcedure(procName, params) {
    return new Promise((resolve, reject) => {
    const body = {
        "procedure": procName
    }
    if (params && Array.isArray(params)) {
        body.params = params;
    }
    else if(params) {
        console.log("Problem with params: ", params)
        reject(new Error("Invalid params: " + params));
        return;
        
    }
    const request = {
        url: "http://localhost:3000/api/procedure",
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: {
            mode: "raw",
            raw: JSON.stringify(
                body
            )
        }
    }



    
        pm.sendRequest(request, (error, response) => {
            //console.log(error, response);
            if (error) { //dbAgent not running, probably
                    //console.log('execProcedure request error:', error.message);
                    reject(error);
                }
            else if (response?.code != 200) {
                //console.log('execProcedure non-200:', response.json());
                reject(new Error(JSON.stringify(response.json())));
                return;
            }
            else {

                    try {
                        response.json();

                    } catch (parseErr) {
                        //console.log('sendSQL response parse error:', parseErr);
                        reject(parseErr);
                    }
                    if (response?.code && response.code !== 200) {
                        //console.log('execProcedure non-OK status:', response.json());
                        reject('Request failed with status ' + response.code + ' ' + JSON.stringify(response.json()));
                    }
                    else if (response?.code === 200 && !response.success === 'true') {
                        //console.log("SQL error: ", response.json());
                        reject(response.json());
                    }
                    else {
                        //console.log("All good", error)
                        resolve(response.json());
                    }
                }
        });
        

    });

}

module.exports = { sendSQL, execProcedure}