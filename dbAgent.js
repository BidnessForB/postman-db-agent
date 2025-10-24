/**
 * Database Agent - REST API for MySQL Database Access
 * Provides HTTP endpoints to query MySQL database from Postman
 */

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Database connection pool
let dbPool;

/**
 * Initialize database connection
 */
async function initDatabase() {
  try {
    dbPool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      database: 'users',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    console.log('Database connection pool created');
  } catch (error) {
    console.log('Database connection error:', error.message);
    process.exit(1);
  }
}

/**
 * Execute raw SQL query
 */
async function executeQuery(sql, params = []) {
  try {
    const [rows] = await dbPool.execute(sql, params);
    return { success: true, data: rows };
  } catch (error) {
    console.log('Query error:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Execute stored procedure
 */
async function executeStoredProcedure(procedureName, params = []) {
  try {
    // Build the CALL statement
    const placeholders = params.map(() => '?').join(', ');
    const sql = `CALL ${procedureName}(${placeholders})`;
    
    const [rows] = await dbPool.execute(sql, params);
    return { success: true, data: rows };
  } catch (error) {
    console.log('Stored procedure error:', error.message);
    return { success: false, error: error.message };
  }
}

// API Routes

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Database agent is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * Execute custom SQL query
 * POST /api/query
 * Body: { "sql": "SELECT * FROM user WHERE userid = ?", "params": [1] }
 */
app.post('/api/query', async (req, res) => {
  try {
    const { sql, params = [] } = req.body;
    
    if (!sql) {
      return res.status(400).json({ 
        success: false, 
        error: 'SQL query is required' 
      });
    }
    
    const result = await executeQuery(sql, params);
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        count: result.data.length
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
    
  } catch (error) {
    console.log('API error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

/**
 * Execute stored procedure
 * POST /api/procedure
 * Body: { "procedure": "AddUser", "params": ["John", "Doe", "john@email.com"] }
 */
app.post('/api/procedure', async (req, res) => {
  try {
    const { procedure, params = [] } = req.body;
    
    if (!procedure) {
      return res.status(400).json({ 
        success: false, 
        error: 'Procedure name is required' 
      });
    }
    
    const result = await executeStoredProcedure(procedure, params);
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        count: result.data.length,
        procedure: procedure
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
    
  } catch (error) {
    console.log('Procedure API error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

/**
 * Get all users
 * GET /api/users
 */
app.get('/api/users', async (req, res) => {
  try {
    const result = await executeQuery('SELECT * FROM user');
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        count: result.data.length
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
    
  } catch (error) {
    console.log('Get users error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch users' 
    });
  }
});

/**
 * Get user by ID
 * GET /api/users/:id
 */
app.get('/api/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID'
      });
    }
    
    const result = await executeQuery(
      'SELECT * FROM user WHERE userid = ?', 
      [userId]
    );
    
    if (result.success) {
      if (result.data.length === 0) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
      } else {
        res.json({
          success: true,
          data: result.data[0]
        });
      }
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
    
  } catch (error) {
    console.log('Get user error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch user' 
    });
  }
});

/**
 * Get user with address
 * GET /api/users/:id/address
 */
app.get('/api/users/:id/address', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID'
      });
    }
    
    const result = await executeQuery(`
      SELECT * FROM address, user 
      WHERE user.userid = ? 
      AND user.userid = address.userid
    `, [userId]);
    
    if (result.success) {
      if (result.data.length === 0) {
        res.status(404).json({
          success: false,
          error: 'User or address not found'
        });
      } else {
        res.json({
          success: true,
          data: result.data[0]
        });
      }
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
    
  } catch (error) {
    console.log('Get user address error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch user address' 
    });
  }
});

/**
 * Get all addresses
 * GET /api/addresses
 */
app.get('/api/addresses', async (req, res) => {
  try {
    const result = await executeQuery('SELECT * FROM address');
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        count: result.data.length
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
    
  } catch (error) {
    console.log('Get addresses error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch addresses' 
    });
  }
});

/**
 * Search users by name
 * GET /api/users/search?name=John
 */
app.get('/api/users/search', async (req, res) => {
  try {
    const { name } = req.query;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Name parameter is required'
      });
    }
    
    const result = await executeQuery(
      'SELECT * FROM user WHERE firstname LIKE ?', 
      [`%${name}%`]
    );
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        count: result.data.length
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
    
  } catch (error) {
    console.log('Search users error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to search users' 
    });
  }
});

/**
 * Add user using stored procedure
 * POST /api/users/add
 * Body: { "firstname": "John", "lastname": "Doe", "email": "john@email.com" }
 */
app.post('/api/users/add', async (req, res) => {
  try {
    const { firstname, lastname, email } = req.body;
    
    if (!firstname || !lastname || !email) {
      return res.status(400).json({
        success: false,
        error: 'firstname, lastname, and email are required'
      });
    }
    
    const result = await executeStoredProcedure('AddUser', [firstname, lastname, email]);
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        message: 'User added successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
    
  } catch (error) {
    console.log('Add user error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add user' 
    });
  }
});

/**
 * Add user with address using stored procedure
 * POST /api/users/add-with-address
 * Body: { "firstname": "John", "lastname": "Doe", "email": "john@email.com", "street": "123 Main St", "city": "New York", "state": "NY", "zipcode": "10001", "country": "USA" }
 */
app.post('/api/users/add-with-address', async (req, res) => {
  try {
    const { firstname, lastname, email, street, city, state, zipcode, country } = req.body;
    
    if (!firstname || !lastname || !email || !street || !city || !state || !zipcode) {
      return res.status(400).json({
        success: false,
        error: 'firstname, lastname, email, street, city, state, and zipcode are required'
      });
    }
    
    const result = await executeStoredProcedure('AddUserWithAddress', [
      firstname, lastname, email, street, city, state, zipcode, country || 'USA'
    ]);
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        message: 'User with address added successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
    
  } catch (error) {
    console.log('Add user with address error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add user with address' 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.log('Unhandled error:', err.message);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
async function startServer() {
  try {
    await initDatabase();
    
    app.listen(PORT, () => {
      console.log(`Database agent running on http://localhost:${PORT}`);
      console.log('Available endpoints:');
      console.log('  GET  /health - Health check');
      console.log('  POST /api/query - Execute custom SQL');
      console.log('  POST /api/procedure - Execute stored procedure');
      console.log('  GET  /api/users - Get all users');
      console.log('  GET  /api/users/:id - Get user by ID');
      console.log('  GET  /api/users/:id/address - Get user with address');
      console.log('  GET  /api/addresses - Get all addresses');
      console.log('  GET  /api/users/search?name=John - Search users');
      console.log('  POST /api/users/add - Add user (stored procedure)');
      console.log('  POST /api/users/add-with-address - Add user with address (stored procedure)');
    });
    
  } catch (error) {
    console.log('Failed to start server:', error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  if (dbPool) {
    await dbPool.end();
  }
  process.exit(0);
});

// Start the server
startServer();
