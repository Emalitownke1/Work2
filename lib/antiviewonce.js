
const fs = require('fs');
const path = require('path');

const antivoPath = path.join(__dirname, '../xmd/antiviewonce.json');
const privateAntivoPath = path.join(__dirname, '../xmd/private_antiviewonce.json');

// Load anti view once data
function loadAntiVOData() {
    try {
        return JSON.parse(fs.readFileSync(antivoPath, 'utf8'));
    } catch {
        return {
            groups: [],
            messages: {}
        };
    }
}

// Save anti view once data
function saveAntiVOData(data) {
    fs.writeFileSync(antivoPath, JSON.stringify(data, null, 2));
}

// Add group to anti view once list
async function addAntiVO(groupId) {
    const data = loadAntiVOData();
    if (!data.groups.includes(groupId)) {
        data.groups.push(groupId);
        saveAntiVOData(data);
    }
}

// Check if group has anti view once enabled
async function isAntiVO(groupId) {
    if (process.env.ANTIVIEWONCE_GLOBAL === 'true') {
        return true;
    }
    const data = loadAntiVOData();
    return data.groups.includes(groupId);
}

// Remove group from anti view once list
async function removeAntiVO(groupId) {
    const data = loadAntiVOData();
    const index = data.groups.indexOf(groupId);
    if (index > -1) {
        data.groups.splice(index, 1);
        saveAntiVOData(data);
    }
}

// Store view once message
async function storeViewOnceMessage(messageId, message) {
    const data = loadAntiVOData();
    data.messages[messageId] = message;
    saveAntiVOData(data);
}

// Get stored view once message
async function getViewOnceMessage(messageId) {
    const data = loadAntiVOData();
    return data.messages[messageId];
}

module.exports = {
    addAntiVO,
    isAntiVO,
    removeAntiVO,
    storeViewOnceMessage,
    getViewOnceMessage
};
