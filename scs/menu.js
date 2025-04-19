
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
        coms[com.categorie].push('│ ⌁ ' + com.nomCom);
    });

    // Main command categories
    coms['AI & ChatBot'] = [
        '│ ⌁ gpt3',
        '│ ⌁ gemini',
        '│ ⌁ dalle',
        '│ ⌁ chatgpt',
        '│ ⌁ bard'
    ];

    coms['Media & Tools'] = [
        '│ ⌁ randomwallpaper',
        '│ ⌁ applenews',
        '│ ⌁ nasanews',
        '│ ⌁ population',
        '│ ⌁ sticker',
        '│ ⌁ photo'
    ];

    coms['Social Media Tools'] = [
        '│ ⌁ smbalance - Check account balance',
        '│ ⌁ smservices - List all services',
        '│ ⌁ smorder - Place new order',
        '│ ⌁ smstatus - Check order status',
        '│ ⌁ freelikes - Free Instagram likes'
    ];

    let menuMessage = `
╭––『 *TREKKER-MD* 』
│
│ ⌬ User: @${dest.split('@')[0]}
│ ⌬ Bot: TREKKER-MD
│ ⌬ Time: ${moment().format('HH:mm:ss')}
│ ⌬ Date: ${moment().format('DD/MM/YYYY')}
╰────────────────╮\n\n`;

    for (const [category, commands] of Object.entries(coms)) {
        menuMessage += `╭––『 *${category}* 』\n`;
        menuMessage += commands.join('\n') + '\n';
        menuMessage += `╰────────────────╯\n\n`;
    }

    menuMessage += `╭––『 *Note* 』
│ Use .help <command> for 
│ detailed command info
╰────────────────╯`;

    let footerText = "TREKKER-MD • Powered by Ibrahim Adams";
    const imageUrl = "https://i.postimg.cc/0Nrf4fxL/IMG-20250419-131400-618.jpg";
    
    zk.sendMessage(dest, { 
        image: { url: imageUrl }, 
        caption: menuMessage, 
        footer: footerText 
    }, { quoted: ms });
});
