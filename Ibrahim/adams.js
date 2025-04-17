var tabCmds = [];
let cm = [];
function adams(obj, fonctions) {
    let infoComs = obj;
    if (!obj.categorie) {
        infoComs.categorie = "General";
    }
    if (!obj.reaction) {
        infoComs.reaction = "🚘";
    }
    infoComs.fonction = fonctions;
    cm.push(infoComs);
    // console.log('chargement...')
    return infoComs;
}
export { adams, adams as Module, cm }; };
