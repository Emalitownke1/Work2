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

    if (!arg[0]) {
        repondre(`*Anti-delete Status for ${groupName}*\n\nType on/off to control anti-delete feature`);
        return;
    }

    if (arg.join(' ').toLowerCase() === 'on') {
        await addAntidelete(dest);
        repondre('Anti-delete has been enabled. Deleted messages will be restored.');
    } else if (arg.join(' ').toLowerCase() === 'off') {
        await removeAntidelete(dest);
        repondre('Anti-delete has been disabled');
    } else {
        repondre('*Invalid option*\nUse on/off only');
    }
});