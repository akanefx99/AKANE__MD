import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import configs from "../utils/configmanager.js";
import { getDevice } from "baileys";
import stylizedChar from "../utils/fancy.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
}

function getCategoryIcon(category) {
  const c = category.toLowerCase();

  if (c === "utils") return "⚙️";
  if (c === "media") return "📸";
  if (c === "group") return "👥";
  if (c === "bug") return "🐞";
  if (c === "tags") return "🏷️";
  if (c === "moderation") return "😶‍🌫️";
  if (c === "owner") return "✨";
  if (c === "creator") return "👑";

  return "🎯"; 
}


export default async function info(client, message) {
  try {
    const remoteJid = message.key.remoteJid;
    const userName = message.pushName || "Unknown";

    
    const usedRam = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);
    const totalRam = (os.totalmem() / 1024 / 1024).toFixed(1);
    const uptime = formatUptime(process.uptime());
    const platform = os.platform();

   
    const botId = client.user.id.split(":")[0];
    const prefix = configs.config.users?.[botId]?.prefix || "!";

    
    const now = new Date();
    const daysFR = [
      "𝐃𝐈𝐌𝐀𝐍𝐂𝐇𝐄",
      "𝐋𝐔𝐍𝐃𝐈",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi"
    ];

    const date =
      `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
    const day = daysFR[now.getDay()];

    
    const handlerPath = path.join(__dirname, "../events/messageHandler.js");
    const handlerCode = fs.readFileSync(handlerPath, "utf-8",);

    const commandRegex =
      /case\s+['"](\w+)['"]\s*:\s*\/\/\s*@cat:\s*([^\n\r]+)/g;

    const categories = {};
    let match;

    while ((match = commandRegex.exec(handlerCode)) !== null) {
      const command = match[1];
      const category = match[2].trim();

      if (!categories[category]) categories[category] = [];
      categories[category].push(command);
    }

    
let menu = `
> *𝐍𝐀𝐌𝐄 :* *𝐀𝐊𝐀𝐍𝐄 𝐌𝐃*
> *𝐃𝐄𝐕 :* *𝐀𝐊𝐀𝐍𝐄 𝐊𝐔𝐑𝐎𝐆𝐀𝐖𝐀*
> *𝐏𝐑𝐄𝐅𝐈𝐗𝐄 :* *${prefix}*
> *𝐔𝐒𝐄𝐑 :* *${stylizedChar(userName)}*
> *𝐕𝐄𝐑𝐒𝐈𝐎𝐍 :* *1.0.0*
> *𝐔𝐏𝐓𝐈𝐌𝐄 :* *${uptime}*
> *𝐑𝐀𝐌 :* *${usedRam}/${totalRam} MB*
> *𝐏𝐋𝐀𝐓𝐅𝐎𝐑𝐌𝐄 :* *${platform}*
> *𝐃𝐀𝐓𝐄 :*  : *${date}* - *${stylizedChar(day)}*
────────────
`;

    for (const [category, commands] of Object.entries(categories)) {
      const icon = getCategoryIcon(category);
      const catName = stylizedChar(category);
      menu += `➪${icon} ${catName}
`;
commands.forEach(cmd => {
  menu += `> 🍉${stylizedChar(cmd)}\n`;
});
menu += `> ━━━━━━━━━━━━━━━
`;
    }

    menu = menu.trim();

    
    try {
      const device = getDevice(message.key.id);

      if (device === "android") {
        await client.sendMessage(remoteJid, {
          image: { url: "database/menu.jpg" },
          caption: stylizedChar(menu),
          contextInfo: {
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            quotedMessage: { conversation: "🍁𝐀𝐊𝐀𝐍𝐄 𝐊𝐔𝐑𝐎𝐆𝐀𝐖𝐀ʕ◕ᴥ◕ʔ🌹" },
            isForwarded: true
          }
        });
      } else {
        await client.sendMessage(
          remoteJid,
          {
            video: { url: "database/DigiX.mp3" },
            caption: stylizedChar(menu)
          },
          { quoted: message }
        );
      }
    } catch (err) {
      await client.sendMessage(
        remoteJid,
        { text: "❌ Erreur lors de l'envoi du menu : " + err.message },
        { quoted: message }
      );
    }

    console.log(menu);

  } catch (err) {
    console.log("error while displaying menu:", err);
  }
}
