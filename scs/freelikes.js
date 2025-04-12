
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

  try {
    repondre("✅ Valid Instagram link detected! Processing your free likes...");
    
    // Place order for 15 likes using service ID 6012
    const order = await addOrder("6012", url, 15);
    
    if (order && order.order) {
      const { recordClaim } = require('../Ibrahim/api/db');
      await recordClaim(dest.split('@')[0], url);
      repondre(`🎉 Congratulations! Your free likes have been successfully claimed!\n\nOrder ID: ${order.order}\n\nFor more services, contact the owner.`);
    } else {
      repondre("❌ Failed to process likes. Please try again later or contact the owner.");
    }
  } catch (error) {
    console.error("Error in freelikes command:", error);
    repondre("❌ An error occurred while processing your request. Please try again later.");
  }
});
