
const fs = require('fs');
const path = require('path');

const antivoPath = path.join(__dirname, '../xmd/antiviewonce.json');
const privateAntivoPath = path.join(__dirname, '../xmd/private_antiviewonce.json');

// Load anti view once data
function loadAntiVOData() {
    try {
        return JSON.parse(fs.readFileSync(antivoPath, 'utf8'));
    } catch {
        return [];
    }
}

// Save anti view once data
function saveAntiVOData(data) {
    fs.writeFileSync(antivoPath, JSON.stringify(data, null, 2));
}

// Add group to anti view once list
async function addAntiVO(groupId) {
    const data = loadAntiVOData();
    if (!data.includes(groupId)) {
        data.push(groupId);
        saveAntiVOData(data);
    }
}

// Check if group has anti view once enabled
async function isAntiVO(groupId) {
    const data = loadAntiVOData();
    return data.includes(groupId);
}

// Remove group from anti view once list
async function removeAntiVO(groupId) {
    const data = loadAntiVOData();
    const index = data.indexOf(groupId);
    if (index > -1) {
        data.splice(index, 1);
        saveAntiVOData(data);
    }
}

module.exports = {
    addAntiVO,
    isAntiVO,
    removeAntiVO
};
