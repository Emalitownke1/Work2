
const { adams } = require('../Ibrahim/adams');
const { addAntiVO, isAntiVO, removeAntiVO } = require("../lib/antiviewonce");

module.exports = {
    nomCom: "antiviewonce",
    categorie: "Group"
};

adams({
    nomCom: 'antiviewonce',
    categorie: 'Group',
    reaction: "👁️",
    desc: "Enable/disable anti-viewonce message feature"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, groupName } = commandeOptions;

    let menu = `╭───────────────◆
│ *ANTI-VIEWONCE MENU*
│ Current Status: ${await isAntiVO(dest) ? '✅ ON' : '❌ OFF'}
│
│ Usage:
│ .antiviewonce on
│ .antiviewonce off
╰────────────◆`;

    if (!arg[0]) {
        return repondre(menu);
    }

    switch (arg[0].toLowerCase()) {
        case 'on':
            if (await isAntiVO(dest)) {
                repondre('Anti-viewonce is already enabled');
            } else {
                await addAntiVO(dest);
                repondre('✅ Anti-viewonce has been enabled');
            }
            break;
        case 'off':
            if (!await isAntiVO(dest)) {
                repondre('Anti-viewonce is already disabled');
            } else {
                await removeAntiVO(dest);
                repondre('❌ Anti-viewonce has been disabled');
            }
            break;
        default:
            repondre(menu);
    }
});
