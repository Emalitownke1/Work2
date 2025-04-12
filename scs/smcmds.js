
const { adams } = require("../Ibrahim/adams");

adams({
  nomCom: "smcmds",
  categorie: "Social",
  reaction: "📜"
}, async (dest, zk, commandeOptions) => {
  const { repondre } = commandeOptions;

  const message = `*📋 Available Social Media Commands*

1. *.freelikes* <instagram-url>
   - Get 15 free likes on your Instagram post
   - One-time use per user
   - Each post can only be used once

2. *.smbalance* 
   - Check account balance (Owner only)

3. *.smservices*
   - List all available services (Owner only)

4. *.smorder* <service_id> <link> <quantity>
   - Place a new order (Owner only)

5. *.smstatus* <order_id>
   - Check order status (Owner only)

Note: Commands marked as "Owner only" are restricted to bot administrators.`;

  repondre(message);
});
