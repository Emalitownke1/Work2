
const { adams } = require('../Ibrahim/adams');
const moment = require('moment-timezone');
const fancy = require('./stylish');

adams({ nomCom: "menu", categorie: "General", reaction: "📋" }, async (dest, zk, commandeOptions) => {
    const { ms, repondre, mybotpic } = commandeOptions;
    const { cm } = require(__dirname + '/../Ibrahim/adams');

    // Theme styles array
    const themes = [
        {
            border: ["╭─", "│ ", "╰─"],
            bullet: "⦿",
            header: "『 *TREKKER-MD* 』",
            separator: "════════════════"
        },
        {
            border: ["┏━", "┃ ", "┗━"],
            bullet: "◈",
            header: "〘 *TREKKER-MD* 〙",
            separator: "━━━━━━━━━━━━━"
        },
        {
            border: ["═══", "║ ", "═══"],
            bullet: "❖",
            header: "《 *TREKKER-MD* 》",
            separator: "╌╌╌╌╌╌╌╌╌╌╌╌╌╌"
        }
    ];

    // Number styles array
    const numberStyles = [
        (i) => `${i}.`,
        (i) => `${fancy[22][i]}⌁`,
        (i) => `${fancy[25][i]}❯`,
        (i) => `${fancy[4][i]}⊷`
    ];

    // Randomly select theme and number style
    const theme = themes[Math.floor(Math.random() * themes.length)];
    const numberStyle = numberStyles[Math.floor(Math.random() * numberStyles.length)];

    var coms = {};
    cm.map((com) => {
        if (!coms[com.categorie]) 
            coms[com.categorie] = [];
        coms[com.categorie].push(`${theme.bullet} ${com.nomCom}`);
    });

    let menuMessage = `
${theme.border[0]}${theme.header}
${theme.border[1]}
${theme.border[1]}⌬ User: @${dest.split('@')[0]}
${theme.border[1]}⌬ Bot: TREKKER-MD
${theme.border[1]}⌬ Time: ${moment().format('HH:mm:ss')}
${theme.border[1]}⌬ Date: ${moment().format('DD/MM/YYYY')}
${theme.border[2]}${theme.separator}\n\n`;

    let cmdCount = 1;
    for (const [category, commands] of Object.entries(coms)) {
        menuMessage += `${theme.border[0]}『 *${category}* 』\n`;
        commands.forEach(cmd => {
            menuMessage += `${theme.border[1]}${numberStyle(cmdCount)} ${cmd}\n`;
            cmdCount++;
        });
        menuMessage += `${theme.border[2]}${theme.separator}\n\n`;
    }

    menuMessage += `${theme.border[0]}『 *Note* 』
${theme.border[1]}Use .help <command> for 
${theme.border[1]}detailed command info
${theme.border[2]}${theme.separator}`;

    let footerText = "TREKKER-MD • Powered by Ibrahim Adams";
    const imageUrl = "https://i.postimg.cc/0Nrf4fxL/IMG-20250419-131400-618.jpg";
    
    zk.sendMessage(dest, { 
        image: { url: imageUrl }, 
        caption: menuMessage, 
        footer: footerText 
    }, { quoted: ms });
});
