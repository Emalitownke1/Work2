
const { adams } = require("../Ibrahim/adams");
const { getAllClaims } = require("../Ibrahim/api/db");

adams({
  nomCom: "claimedjson",
  categorie: "Owner",
  reaction: "📊"
}, async (dest, zk, commandeOptions) => {
  const { repondre, superUser } = commandeOptions;
  
  if (!superUser) {
    repondre('This command is only for the bot owner');
    return;
  }

  try {
    const claims = await getAllClaims();
    repondre(JSON.stringify(claims, null, 2));
  } catch (error) {
    console.error("Error fetching claims:", error);
    repondre("Error fetching claims data");
  }
});
