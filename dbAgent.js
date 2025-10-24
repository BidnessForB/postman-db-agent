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
 * Status check endpoint
 */
app.get('/status', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Database agent is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * Execute custom SQL query
 * POST /api/query
 * Body: { "query": "SELECT * FROM user W HERE userid = ?", "params": [1] }
 */
app.post('/api/query', async (req, res) => {
  try {
    const { query, params = [] } = req.body;
    
    if (!query) {
      return res.status(400).json({ 
        success: false, 
        error: 'SQL query is required' 
      });
    }
    
    const result = await executeQuery(query, params);
    
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
      console.log('  GET  /status - Status check');
      console.log('  POST /api/query - Execute custom SQL');
      console.log('  POST /api/procedure - Execute stored procedure');
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
