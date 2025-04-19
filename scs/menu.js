
const { adams } = require('../Ibrahim/adams'); const moment = require('moment-timezone'); const s = require(__dirname + '/../config');

adams({ nomCom: "menu", categorie: "General", reaction: "📋" }, async (dest, zk, commandeOptions) => { const { ms, repondre, mybotpic } = commandeOptions; const { cm } = require(__dirname + '/../Ibrahim/adams');

var coms = {}; cm.map((com) => { if (!coms[com.categorie]) coms[com.categorie] = []; coms[com.categorie].push(com.nomCom); });

// Including AI & Fun commands coms['AI & Fun'] = [ '🟢 gpt3', '🟢 gemini', '🟢 randomwallpaper', '🟢 random', '🟢 applenews', '🟢 nasanews', '🟢 population' ];

// Additional commands in other categories coms['AUTO EDIT MENU'] = [ '🟢 deep', '🟢 bass', '🟢 reverse', '🟢 slow', '🟢 smooth', '🟢 tempo', '🟢 nightcore' ];

coms['DOWNLOAD MENU'] = [ '🟢 nature', '🟢 fetch', '🟢 github', '🟢 google', '🟢 imdb', '🟢 movie', '🟢 lyrics', '🟢 define', '🟢 google2', '🟢 imdb2', '🟢 series', '🟢 stickersearch', '🟢 img', '🟢 play', '🟢 song', '🟢 video', '🟢 gpt', '🟢 twitter', '🟢 like', '🟢 capcut', '🟢 pinterest', '🟢 tiktok', '🟢 xnxx', '🟢 apk' ];

coms['CONTROL MENU'] = [ '🟢 getallvar', '🟢 settings', '🟢 setvar', '🟢 update', '🟢 setcmd', '🟢 delcmd', '🟢 allcmd' ];

coms['CONVERSATION MENU'] = [ '🟢 emomix', '🟢 emoji', '🟢 sticker', '🟢 scrop', '🟢 take', '🟢 write', '🟢 photo', '🟢 trt' ];

coms['FUN MENU'] = [ '🟢 hwaifu', '🟢 trap', '🟢 hneko', '🟢 blowjob', '🟢 hentaivid', '🟢 fancy', '🟢 ranime', '🟢 profile', '🟢 quote', '🟢 randompic', '🟢 rank', '🟢 toprank', '🟢 hack', '🟢 lines', '🟢 insult', '🟢 dare', '🟢 truth', '🟢 jokes', '🟢 advice', '🟢 trivia', '🟢 bully', '🟢 cuddle', '🟢 cry', '🟢 hug', '🟢 awoo', '🟢 kiss', '🟢 lick', '🟢 pat', '🟢 smug', '🟢 bonk', '🟢 yeet', '🟢 blush', '🟢 smile', '🟢 wave', '🟢 highfive', '🟢 handhold', '🟢 nom', '🟢 bite', '🟢 glomp', '🟢 slap', '🟢 kill', '🟢 kick', '🟢 happy', '🟢 wink', '🟢 poke', '🟢 dance', '🟢 cringe' ];

coms['GAMES MENU'] = [ '🟢 riddle' ];

coms['GENERAL MENU'] = [ '🟢 cmd', '🟢 obt', '🟢 owner', '🟢 dev', '🟢 support', '🟢 poll', '🟢 alive', '🟢 test', '🟢 ping', '🟢 pairaudio', '🟢 uptime', '🟢 url', '🟢 menu', '🟢 phone', '🟢 mail', '🟢 calc', '🟢 time', '🟢 inspire' ];

let menuMessage = "*📋 COMMAND MENU 📋*\n\n"; for (const [category, commands] of Object.entries(coms)) { menuMessage += `*${category} Commands*\n`; menuMessage += commands.join('\n') + '\n\n'; }

let footerText = "Made by Ibrahim Adams"; const lien = mybotpic(); if (lien.match(/\.(mp4|gif)$/i)) { zk.sendMessage(dest, { video: { url: lien }, caption: menuMessage, footer: footerText }, { quoted: ms }); } else if (lien.match(/\.(jpeg|png|jpg)$/i)) { zk.sendMessage(dest, { image: { url: lien }, caption: menuMessage, footer: footerText }, { quoted: ms }); } else { repondre(menuMessage); } });
