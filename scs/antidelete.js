
const { adams } = require('../Ibrahim/adams');
const {addAntidelete, isAntiDelete, removeAntidelete} = require("../lib/antidelete");

adams({
    nomCom: 'antidelete',
    categorie: 'Group',
    reaction: "🔄"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, verifGroupe, verifAdmin, superUser } = commandeOptions;

    if (!verifGroupe) { 
        repondre("This command is only for groups"); 
        return; 
    }

    if (!verifAdmin && !superUser) {
        repondre("This command is only for admins");
        return;
    }

    if (!arg[0]) {
        repondre("Use 'on' to enable antidelete\nUse 'off' to disable antidelete");
        return;
    }

    if (arg[0] === "on") {
        if (await isAntiDelete(dest)) {
            repondre("Antidelete is already enabled in this group");
            return;
        }
        await addAntidelete(dest);
        repondre("Antidelete has been enabled. Deleted messages will be resent.");
    } else if (arg[0] === "off") {
        if (!await isAntiDelete(dest)) {
            repondre("Antidelete is already disabled in this group");
            return;
        }
        await removeAntidelete(dest);
        repondre("Antidelete has been disabled");
    } else {
        repondre("Invalid option. Use 'on' to enable or 'off' to disable");
    }
});
