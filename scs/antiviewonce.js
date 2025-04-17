const {adams} = require('../Ibrahim/adams');
const {addAntiVO, isAntiVO, removeAntiVO, storeViewOnceMessage, getViewOnceMessage} = require("../lib/antiviewonce");

// Handle view once messages
adams({}, async (dest, zk, commandeOptions) => {
    zk.ev.on('messages.upsert', async ({messages}) => {
        for (const message of messages) {
            if (message.message?.viewOnceMessage && await isAntiVO(message.key.remoteJid)) {
                const viewOnceData = message.message.viewOnceMessage.message;
                await storeViewOnceMessage(message.key.id, viewOnceData);
                
                // Send the media without view once restriction
                if (viewOnceData.imageMessage) {
                    await zk.sendMessage(message.key.remoteJid, {
                        image: { url: await zk.downloadAndSaveMediaMessage(viewOnceData.imageMessage) },
                        caption: viewOnceData.imageMessage.caption || "View Once Image",
                    });
                } else if (viewOnceData.videoMessage) {
                    await zk.sendMessage(message.key.remoteJid, {
                        video: { url: await zk.downloadAndSaveMediaMessage(viewOnceData.videoMessage) },
                        caption: viewOnceData.videoMessage.caption || "View Once Video",
                    });
                }
            }
        }
    });
});

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