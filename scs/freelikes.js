
const { adams } = require("../Ibrahim/adams");
const { addOrder } = require("../Ibrahim/api/yoyomedia");

adams({
  nomCom: "freelikes",
  categorie: "Social",
  reaction: "❤️"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg } = commandeOptions;

  if (!arg[0]) {
    return repondre("Please provide an Instagram post URL\nExample: .freelikes https://www.instagram.com/p/xyz123");
  }

  const url = arg[0];
  
  // Basic Instagram URL validation
  if (!url.match(/https:\/\/(www\.)?instagram\.com\/p\/[A-Za-z0-9_-]+/)) {
    return repondre("❌ Invalid Instagram URL. Please provide a valid Instagram post link.");
  }

  const { Pool } = require('pg');
  const pool = new Pool({
    connectionString: process.env.SM_DB
  });

  try {
    // Check if user has already claimed
    const userResult = await pool.query('SELECT * FROM freelikes_claims WHERE user_id = $1', [dest.split('@')[0]]);
    if (userResult.rows.length > 0) {
      return repondre("❌ You have already claimed your free likes. Each user can only claim once.");
    }

    // Check if link was already used
    const linkResult = await pool.query('SELECT * FROM freelikes_claims WHERE instagram_link = $1', [url]);
    if (linkResult.rows.length > 0) {
      return repondre("❌ This Instagram post link has already been used. Each post can only receive likes once.");
    }

    repondre("✅ Valid Instagram link detected! Processing your free likes...");
    
    try {
      // Check service availability first
      const services = await require('../Ibrahim/api/yoyomedia').getServices();
      const likeService = services.find(s => s.service === "2");
      
      if (!likeService) {
        return repondre("❌ Service temporarily unavailable. Please try again later.");
      }

      // Place order for 15 likes using service ID 6012
      const order = await addOrder("6012", url, 15);
      
      if (order && (order.order || order.id)) {
        const { recordClaim } = require('../Ibrahim/api/db');
        await recordClaim(dest.split('@')[0], url);
        return repondre(`🎉 Congratulations! Your free likes order is confirmed!\n\nOrder ID: ${order.order || order.id}\n\nLikes will be delivered within 24 hours.`);
      } 
      
      console.error('Invalid API Response:', order);
      return repondre("❌ Order processing failed. Please try again in a few minutes.");
      
    } catch (error) {
      console.error('YoYoMedia API Error:', error?.response?.data || error);
      return repondre("❌ Service Error: Unable to process request at this time. Please try again later.");
    }
  } catch (error) {
    console.error("Error in freelikes command:", error);
    repondre("❌ An error occurred while processing your request. Please try again later.");
  }
});
