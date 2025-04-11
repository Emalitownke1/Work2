
const { adams } = require('../Ibrahim/adams');
const { addAntidelete, isAntiDelete, removeAntidelete } = require("../lib/antidelete");

module.exports = {
    nomCom: "antidelete",
    categorie: "Group"
};

adams({
    nomCom: 'antidelete',
    categorie: 'Group',
    reaction: "🗑️",
    desc: "Enable/disable anti-delete message feature"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, groupName } = commandeOptions;

    let menu = `╭───────────────◆
│ *ANTI-DELETE MENU*
│ Current Status: ${await isAntiDelete(dest) ? '✅ ON' : '❌ OFF'}
│
│ Usage:
│ .antidelete on
│ .antidelete off
╰────────────◆`;

    if (!arg[0]) {
        return repondre(menu);
    }

    switch (arg[0].toLowerCase()) {
        case 'on':
            if (await isAntiDelete(dest)) {
                repondre('Anti-delete is already enabled');
            } else {
                await addAntidelete(dest);
                repondre('✅ Anti-delete has been enabled');
            }
            break;
        case 'off':
            if (!await isAntiDelete(dest)) {
                repondre('Anti-delete is already disabled');
            } else {
                await removeAntidelete(dest);
                repondre('❌ Anti-delete has been disabled');
            }
            break;
        default:
            repondre(menu);
    }
});
