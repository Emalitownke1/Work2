
const { adams } = require('../Ibrahim/adams');
const { addAntiVO, isAntiVO, removeAntiVO } = require("../lib/antiviewonce");

adams({
    nomCom: 'antiviewonce',
    categorie: 'Group',
    reaction: "👁️"
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
        repondre("Use 'on' to enable anti view once\nUse 'off' to disable anti view once");
        return;
    }

    if (arg[0] === "on") {
        if (await isAntiVO(dest)) {
            repondre("Anti view once is already enabled in this group");
            return;
        }
        await addAntiVO(dest);
        repondre("Anti view once has been enabled. View once media will be converted to normal media.");
    } else if (arg[0] === "off") {
        if (!await isAntiVO(dest)) {
            repondre("Anti view once is already disabled in this group");
            return;
        }
        await removeAntiVO(dest);
        repondre("Anti view once has been disabled");
    } else {
        repondre("Invalid option. Use 'on' to enable or 'off' to disable");
    }
});
