const {adams} = require('../Ibrahim/adams');
const {addAntiVO, isAntiVO, removeAntiVO} = require("../lib/antiviewonce");

module.exports = {
    nomCom: "antiviewonce",
    categorie: "Group",
    desc: "Enable/disable anti-viewonce feature in groups"
};

adams({
    nomCom: "antiviewonce",
    categorie: "Group",
    desc: "Enable/disable anti-viewonce message feature",
    reaction: "👁️"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, verifAdmin, superUser, groupName } = commandeOptions;

    if (!verifAdmin && !superUser) { repondre("This command is only for admins"); return; }

    if (!arg[0]) {
        repondre(`*Anti-ViewOnce Status*\n\nType on/off to control anti-viewonce feature`);
        return;
    }

    if (arg.join(' ').toLowerCase() === 'on') {
        await addAntiVO(dest);
        repondre('Anti-ViewOnce has been enabled. View-once media will be converted to normal media.');
    } else if (arg.join(' ').toLowerCase() === 'off') {
        await removeAntiVO(dest);
        repondre('Anti-ViewOnce has been disabled');
    } else {
        repondre('*Invalid option*\nUse on/off only');
    }
});