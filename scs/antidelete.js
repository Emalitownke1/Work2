
const {adams} = require('../Ibrahim/adams');
const {addAntidelete, isAntiDelete, removeAntidelete} = require("../lib/antidelete");

adams({
    nomCom: "antidelete",
    categorie: "Group",
    desc: "Enable/disable anti-delete message feature",
    reaction: "🗑️"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, verifGroupe, verifAdmin, superUser, groupName } = commandeOptions;

    if (!verifGroupe) { repondre("This command is only for groups"); return; }
    if (!verifAdmin && !superUser) { repondre("This command is only for admins"); return; }

    const status = await isAntiDelete(dest) ? '✅ Enabled' : '❌ Disabled';
    
    if (!arg[0]) {
        repondre(`*Anti-Delete Status*\n\n` +
                 `Current Status: ${status}\n\n` +
                 `Commands:\n` +
                 `➮ ,antidelete on - Enable anti-delete\n` +
                 `➮ ,antidelete off - Disable anti-delete`);
        return;
    }

    if (arg.join(' ').toLowerCase() === 'on') {
        if (await isAntiDelete(dest)) {
            repondre('Anti-delete is already enabled');
        } else {
            await addAntidelete(dest);
            repondre('✅ Anti-delete has been enabled. Deleted messages will be restored.');
        }
    } else if (arg.join(' ').toLowerCase() === 'off') {
        if (!await isAntiDelete(dest)) {
            repondre('Anti-delete is already disabled');
        } else {
            await removeAntidelete(dest);
            repondre('❌ Anti-delete has been disabled');
        }
    } else {
        repondre('*Invalid option*\nUse on/off only');
    }
});
