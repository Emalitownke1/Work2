
const {adams} = require("../Ibrahim/adams");
const fs = require('fs');
const path = require('path');
const {exec} = require('child_process');

adams({
  nomCom: "reset",
  categorie: "Mods",
  reaction: "🔄"
}, async (dest, z, com) => {
  const {repondre, superUser} = com;
  
  if (!superUser) {
    return repondre("This command is for owner only");
  }

  try {
    // Send initial message
    await repondre("🔄 *Resetting BWM XMD Bot...*\n_Cleaning session files..._");
    
    // Clear Session directory
    const sessionDir = path.join(__dirname, '../Session');
    if (fs.existsSync(sessionDir)) {
      fs.readdirSync(sessionDir).forEach(file => {
        const filePath = path.join(sessionDir, file);
        fs.unlinkSync(filePath);
      });
    }

    // Clear store.json
    const storePath = path.join(__dirname, '../store.json');
    if (fs.existsSync(storePath)) {
      fs.writeFileSync(storePath, '{}');
    }

    await repondre("✅ *Session files cleaned*\n_Restarting bot..._");

    // Restart the bot
    exec('pm2 restart all');

  } catch (error) {
    console.error('Reset Error:', error);
    return repondre("❌ Error during reset: " + error.message);
  }
});
