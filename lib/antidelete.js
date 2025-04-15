
const fs = require('fs');
const path = require('path');

const antideletePath = path.join(__dirname, '../xmd/antidelete.json');

// Load antidelete data
function loadAntideleteData() {
    try {
        return JSON.parse(fs.readFileSync(antideletePath, 'utf8'));
    } catch {
        return {
            groups: [],
            messages: {}
        };
    }
}

// Save antidelete data
function saveAntideleteData(data) {
    fs.writeFileSync(antideletePath, JSON.stringify(data, null, 2));
}

// Add group to antidelete list
async function addAntidelete(groupId) {
    const data = loadAntideleteData();
    if (!data.groups.includes(groupId)) {
        data.groups.push(groupId);
        saveAntideleteData(data);
    }
}

// Check if group has antidelete enabled
async function isAntiDelete(groupId) {
    const data = loadAntideleteData();
    return data.groups.includes(groupId);
}

// Remove group from antidelete list
async function removeAntidelete(groupId) {
    const data = loadAntideleteData();
    const index = data.groups.indexOf(groupId);
    if (index > -1) {
        data.groups.splice(index, 1);
        saveAntideleteData(data);
    }
}

// Store message for tracking
async function storeMessage(messageId, message) {
    const data = loadAntideleteData();
    data.messages[messageId] = message;
    saveAntideleteData(data);
}

// Get stored message
async function getStoredMessage(messageId) {
    const data = loadAntideleteData();
    return data.messages[messageId];
}

module.exports = {
    addAntidelete,
    isAntiDelete,
    removeAntidelete,
    storeMessage,
    getStoredMessage
};
