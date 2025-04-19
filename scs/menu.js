
```javascript
const { adams } = require('../Ibrahim/adams');
const moment = require('moment-timezone');
const s = require(__dirname + '/../config');

adams({ nomCom: "menu", categorie: "General", reaction: "📋" }, async (dest, zk, commandeOptions) => {
    const { ms, repondre, mybotpic } = commandeOptions;
    const { cm } = require(__dirname + '/../Ibrahim/adams');

    var coms = {};
    cm.map((com) => {
        if (!coms[com.categorie]) 
            coms[com.categorie] = [];
        coms[com.categorie].push(com.nomCom);
    });

    // Including the specific commands in the menu
    coms['AI & Fun'] = [
        '🟢 gpt3',
        '🟢 gemini',
        '🟢 randomwallpaper',
        '🟢 random',
        '🟢 applenews',
        '🟢 nasanews',
        '🟢 population'
    ];

    let menuMessage = "*📋 COMMAND MENU 📋*\n\n";
    for (const [category, commands] of Object.entries(coms)) {
        menuMessage += `*${category} Commands*\n`;
        menuMessage += commands.join('\n') + '\n\n';
    }

    let footerText = "Made by Ibrahim Adams";
    var lien = mybotpic();
    if (lien.match(/\.(mp4|gif)$/i)) {
        zk.sendMessage(dest, { video: { url: lien }, caption: menuMessage, footer: footerText }, { quoted: ms });
    } else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
        zk.sendMessage(dest, { image: { url: lien }, caption: menuMessage, footer: footerText }, { quoted: ms });
    } else {
        repondre(menuMessage);
    }
});
```

