
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
      // Place order for 15 likes using service ID 6012
      const order = await addOrder("6012", url, 15);
      
      if (order && (order.order || order.id)) {
        const { recordClaim } = require('../Ibrahim/api/db');
        await recordClaim(dest.split('@')[0], url);
        repondre(`🎉 Congratulations! Your free likes have been successfully claimed!\n\nOrder ID: ${order.order || order.id}\n\nLikes will be delivered within 24 hours.\nFor more services, contact the owner.`);
      } else {
        console.error('API Response:', order);
        repondre("❌ Failed to process likes. The service may be temporarily unavailable. Please try again in a few minutes.");
      }
    } catch (error) {
      console.error('Order Error:', error);
      repondre("❌ Service Error: " + (error.message || "Unknown error occurred while processing your request."));
    }
  } catch (error) {
    console.error("Error in freelikes command:", error);
    repondre("❌ An error occurred while processing your request. Please try again later.");
  }
});
