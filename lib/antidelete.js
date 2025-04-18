
const fs = require('fs');
const path = require('path');

const antideletePath = path.join(__dirname, '../xmd/antidelete.json');

// Load antidelete data
function loadAntideleteData() {
    try {
        return JSON.parse(fs.readFileSync(antideletePath, 'utf8'));
    } catch {
        return [];
    }
}

// Save antidelete data
function saveAntideleteData(data) {
    fs.writeFileSync(antideletePath, JSON.stringify(data, null, 2));
}

// Add group to antidelete list
async function addAntidelete(groupId) {
    const data = loadAntideleteData();
    if (!data.includes(groupId)) {
        data.push(groupId);
        saveAntideleteData(data);
    }
}

// Check if group has antidelete enabled
async function isAntiDelete(groupId) {
    const data = loadAntideleteData();
    return data.includes(groupId);
}

// Remove group from antidelete list
async function removeAntidelete(groupId) {
    const data = loadAntideleteData();
    const index = data.indexOf(groupId);
    if (index > -1) {
        data.splice(index, 1);
        saveAntideleteData(data);
    }
}

module.exports = {
    addAntidelete,
    isAntiDelete,
    removeAntidelete
};
