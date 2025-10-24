# Postman Test Script Examples

This document shows how to call the Database Agent API endpoints from Postman test scripts.

## Execute Custom SQL Request

### Basic Test Script Example

```javascript
// Test script for Execute Custom SQL request
pm.test("Execute Custom SQL - Get User Count", function () {
    // Send the request
    pm.sendRequest({
        url: pm.environment.get("base_url") + "/api/query",
        method: 'POST',
        header: {
            'Content-Type': 'application/json'
        },
        body: {
            mode: 'raw',
            raw: JSON.stringify({
                "query": "SELECT COUNT(*) as user_count FROM user",
                "params": []
            })
        }
    }, function (err, response) {
        // Test assertions
        pm.expect(err).to.be.null;
        pm.expect(response.code).to.equal(200);
        
        const responseJson = response.json();
        pm.expect(responseJson.success).to.be.true;
        pm.expect(responseJson.data).to.be.an('array');
        pm.expect(responseJson.data.length).to.be.greaterThan(0);
        
        // Log the result
        console.log("User count:", responseJson.data[0].user_count);
    });
});
```

### Advanced Test Script with Multiple Queries

```javascript
// Test script for multiple SQL queries
pm.test("Execute Multiple Custom SQL Queries", function () {
    const queries = [
        {
            name: "Get User Count",
            query: "SELECT COUNT(*) as user_count FROM user",
            params: []
        },
        {
            name: "Get Users by First Name",
            query: "SELECT * FROM user WHERE firstname = ?",
            params: ["John"]
        },
        {
            name: "Get Users with Addresses",
            query: "SELECT u.userid, u.firstname, u.lastname, a.street, a.city FROM user u LEFT JOIN address a ON u.userid = a.userid",
            params: []
        }
    ];
    
    queries.forEach((queryData, index) => {
        pm.sendRequest({
            url: pm.environment.get("base_url") + "/api/query",
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            body: {
                mode: 'raw',
                raw: JSON.stringify({
                    "query": queryData.query,
                    "params": queryData.params
                })
            }
        }, function (err, response) {
            pm.expect(err).to.be.null;
            pm.expect(response.code).to.equal(200);
            
            const responseJson = response.json();
            pm.expect(responseJson.success).to.be.true;
            
            console.log(`Query ${index + 1} (${queryData.name}) executed successfully`);
            console.log("Result:", responseJson.data);
        });
    });
});
```

### Test Script with Error Handling

```javascript
// Test script with comprehensive error handling
pm.test("Execute Custom SQL with Error Handling", function () {
    // Test valid query
    pm.sendRequest({
        url: pm.environment.get("base_url") + "/api/query",
        method: 'POST',
        header: {
            'Content-Type': 'application/json'
        },
        body: {
            mode: 'raw',
            raw: JSON.stringify({
                "query": "SELECT * FROM user LIMIT 5",
                "params": []
            })
        }
    }, function (err, response) {
        pm.expect(err).to.be.null;
        pm.expect(response.code).to.equal(200);
        
        const responseJson = response.json();
        pm.expect(responseJson.success).to.be.true;
        pm.expect(responseJson.data).to.be.an('array');
        
        console.log("Valid query executed successfully");
        console.log("Number of users returned:", responseJson.data.length);
    });
    
    // Test invalid query
    pm.sendRequest({
        url: pm.environment.get("base_url") + "/api/query",
        method: 'POST',
        header: {
            'Content-Type': 'application/json'
        },
        body: {
            mode: 'raw',
            raw: JSON.stringify({
                "query": "SELECT * FROM nonexistent_table",
                "params": []
            })
        }
    }, function (err, response) {
        pm.expect(err).to.be.null;
        pm.expect(response.code).to.equal(500);
        
        const responseJson = response.json();
        pm.expect(responseJson.success).to.be.false;
        pm.expect(responseJson.error).to.be.a('string');
        
        console.log("Invalid query handled correctly");
        console.log("Error message:", responseJson.error);
    });
});
```

### Test Script with Data Validation

```javascript
// Test script with data validation
pm.test("Execute Custom SQL with Data Validation", function () {
    pm.sendRequest({
        url: pm.environment.get("base_url") + "/api/query",
        method: 'POST',
        header: {
            'Content-Type': 'application/json'
        },
        body: {
            mode: 'raw',
            raw: JSON.stringify({
                "query": "SELECT userid, firstname, lastname, email FROM user WHERE userid = ?",
                "params": [1]
            })
        }
    }, function (err, response) {
        pm.expect(err).to.be.null;
        pm.expect(response.code).to.equal(200);
        
        const responseJson = response.json();
        pm.expect(responseJson.success).to.be.true;
        pm.expect(responseJson.data).to.be.an('array');
        
        if (responseJson.data.length > 0) {
            const user = responseJson.data[0];
            
            // Validate user data structure
            pm.expect(user).to.have.property('userid');
            pm.expect(user).to.have.property('firstname');
            pm.expect(user).to.have.property('lastname');
            pm.expect(user).to.have.property('email');
            
            // Validate data types
            pm.expect(user.userid).to.be.a('number');
            pm.expect(user.firstname).to.be.a('string');
            pm.expect(user.lastname).to.be.a('string');
            pm.expect(user.email).to.be.a('string');
            
            // Validate email format
            pm.expect(user.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
            
            console.log("User data validation passed");
            console.log("User:", user);
        }
    });
});
```

## Execute Stored Procedure Request

### Basic Stored Procedure Test Script

```javascript
// Test script for Execute Stored Procedure request
pm.test("Execute Stored Procedure - GetAllUsers", function () {
    pm.sendRequest({
        url: pm.environment.get("base_url") + "/api/procedure",
        method: 'POST',
        header: {
            'Content-Type': 'application/json'
        },
        body: {
            mode: 'raw',
            raw: JSON.stringify({
                "procedure": "GetAllUsers",
                "params": []
            })
        }
    }, function (err, response) {
        pm.expect(err).to.be.null;
        pm.expect(response.code).to.equal(200);
        
        const responseJson = response.json();
        pm.expect(responseJson.success).to.be.true;
        pm.expect(responseJson.data).to.be.an('array');
        pm.expect(responseJson.procedure).to.equal("GetAllUsers");
        
        console.log("GetAllUsers procedure executed successfully");
        console.log("Number of users:", responseJson.data.length);
    });
});
```

### Stored Procedure with Parameters Test Script

```javascript
// Test script for stored procedure with parameters
pm.test("Execute Stored Procedure with Parameters", function () {
    pm.sendRequest({
        url: pm.environment.get("base_url") + "/api/procedure",
        method: 'POST',
        header: {
            'Content-Type': 'application/json'
        },
        body: {
            mode: 'raw',
            raw: JSON.stringify({
                "procedure": "AddUser",
                "params": ["Test", "User", "test.user@email.com"]
            })
        }
    }, function (err, response) {
        pm.expect(err).to.be.null;
        pm.expect(response.code).to.equal(200);
        
        const responseJson = response.json();
        pm.expect(responseJson.success).to.be.true;
        pm.expect(responseJson.data).to.be.an('array');
        pm.expect(responseJson.procedure).to.equal("AddUser");
        
        console.log("AddUser procedure executed successfully");
        console.log("Result:", responseJson.data);
    });
});
```

## Status Check Request

### Basic Status Check Test Script

```javascript
// Test script for Status Check request
pm.test("Status Check", function () {
    pm.sendRequest({
        url: pm.environment.get("base_url") + "/status",
        method: 'GET'
    }, function (err, response) {
        pm.expect(err).to.be.null;
        pm.expect(response.code).to.equal(200);
        
        const responseJson = response.json();
        pm.expect(responseJson.status).to.equal("ok");
        pm.expect(responseJson.message).to.equal("Database agent is running");
        pm.expect(responseJson.timestamp).to.be.a('string');
        
        console.log("Database agent is running");
        console.log("Status:", responseJson.status);
        console.log("Timestamp:", responseJson.timestamp);
    });
});
```

## Environment Variables Setup

### Required Environment Variables

Create these environment variables in Postman:

```javascript
// Environment variables
base_url = "http://localhost:3000"
```

### Dynamic Environment Variables

```javascript
// Set dynamic environment variables in test scripts
pm.environment.set("base_url", "http://localhost:3000");
pm.environment.set("test_user_id", "1");
pm.environment.set("test_user_name", "John");
```

## Complete Test Suite Example

```javascript
// Complete test suite for Database Agent API
pm.test("Database Agent API Complete Test Suite", function () {
    // Test 1: Status Check
    pm.sendRequest({
        url: pm.environment.get("base_url") + "/status",
        method: 'GET'
    }, function (err, response) {
        pm.expect(err).to.be.null;
        pm.expect(response.code).to.equal(200);
        console.log("✓ Status check passed");
    });
    
    // Test 2: Custom SQL Query
    pm.sendRequest({
        url: pm.environment.get("base_url") + "/api/query",
        method: 'POST',
        header: { 'Content-Type': 'application/json' },
        body: {
            mode: 'raw',
            raw: JSON.stringify({
                "query": "SELECT COUNT(*) as user_count FROM user",
                "params": []
            })
        }
    }, function (err, response) {
        pm.expect(err).to.be.null;
        pm.expect(response.code).to.equal(200);
        console.log("✓ Custom SQL query passed");
    });
    
    // Test 3: Stored Procedure
    pm.sendRequest({
        url: pm.environment.get("base_url") + "/api/procedure",
        method: 'POST',
        header: { 'Content-Type': 'application/json' },
        body: {
            mode: 'raw',
            raw: JSON.stringify({
                "procedure": "GetAllUsers",
                "params": []
            })
        }
    }, function (err, response) {
        pm.expect(err).to.be.null;
        pm.expect(response.code).to.equal(200);
        console.log("✓ Stored procedure passed");
    });
});
```

## Usage Instructions

1. **Import the Postman Collection**: Import `Postman_Database_Agent_Collection.json`
2. **Set Environment Variables**: Create an environment with `base_url = "http://localhost:3000"`
3. **Add Test Scripts**: Copy the test scripts above into the "Tests" tab of your requests
4. **Run Tests**: Execute the requests to run the test scripts

## Tips for Writing Test Scripts

1. **Always check for errors**: Use `pm.expect(err).to.be.null`
2. **Validate response codes**: Use `pm.expect(response.code).to.equal(200)`
3. **Validate response structure**: Check for required fields and data types
4. **Use console.log**: For debugging and logging results
5. **Test both success and error cases**: Include negative test scenarios
6. **Use environment variables**: For flexible configuration
7. **Group related tests**: Use descriptive test names and organize logically
