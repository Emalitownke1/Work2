
const { adams } = require("../Ibrahim/adams");
const { addOrder } = require("../Ibrahim/api/yoyomedia");
const { recordClaim, getAllClaims } = require("../Ibrahim/api/db");

adams({
  nomCom: "freelikes",
  categorie: "Social",
  reaction: "❤️"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, auteurMessage } = commandeOptions;

  if (!arg[0]) {
    return repondre("Please provide an Instagram post URL\nExample: .freelikes https://www.instagram.com/p/xyz123");
  }

  const url = arg[0];
  const userId = auteurMessage.split('@')[0];

  // Basic Instagram URL validation
  if (!url.match(/https:\/\/(www\.)?instagram\.com\/p\/[A-Za-z0-9_-]+/)) {
    return repondre("❌ Invalid Instagram URL. Please provide a valid Instagram post link.");
  }

  try {
    // Check if user has already claimed
    const claims = await getAllClaims();
    const userClaim = claims.find(claim => claim.user_id === userId);
    
    if (userClaim) {
      return repondre("❌ You have already claimed your free likes. This offer is one-time only per user.");
    }

    repondre("✅ Valid Instagram link detected! Processing your free likes...");

    // Place order for 15 likes using service ID 6012
    const order = await addOrder({
      service: "6012",
      link: url,
      quantity: 15
    });

    if (order && (order.order || order.id)) {
      // Record successful claim
      await recordClaim(userId, url);
      
      return repondre(`🎉 Congratulations! Your free likes have been successfully claimed!

Order ID: ${order.order || order.id}

📢 Contact TREKKER for bulk purchase of likes and other social media services.`);
    } 

    console.error('Invalid API Response:', order);
    return repondre("❌ Order processing failed. Please try again in a few minutes.");

  } catch (error) {
    console.error('Order Error:', error?.response?.data || error);
    return repondre("❌ Service Error: Unable to process request at this time. Please try again later.");
  }
});
