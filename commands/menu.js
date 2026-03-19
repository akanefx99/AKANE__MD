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

  if (c === "premium") return "💫";

  return "🎯"; 

}

function getCategoryBorder(category) {

  const c = category.toLowerCase();

  if (c === "moderation") return "🛡️ MODERATION 🛡️";

  if (c === "premium") return "💎 PREMIUM 💎";

  if (c === "owner") return "👑 OWNER 👑";

  if (c === "creator") return "⭐ CREATOR ⭐";

  if (c === "utils") return "🔧 UTILS 🔧";

  if (c === "media") return "🎬 MEDIA 🎬";

  if (c === "group") return "👥 GROUP 👥";

  if (c === "bug") return "🐛 BUG 🐛";

  if (c === "tags") return "🏷️ TAGS 🏷️";

  return "🎯 " + category.toUpperCase() + " 🎯";

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

    const days = [

      "DIMANCHE", "LUNDI", "MARDI", "MERCREDI", 

      "JEUDI", "VENDREDI", "SAMEDI"

    ];

    const date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;

    const day = days[now.getDay()];

    const handlerPath = path.join(__dirname, "../events/messageHandler.js");

    const handlerCode = fs.readFileSync(handlerPath, "utf-8");

    const commandRegex = /case\s+['"](\w+)['"]\s*:\s*\/\/\s*@cat:\s*([^\n\r]+)/g;

    const categories = {};

    let match;

    while ((match = commandRegex.exec(handlerCode)) !== null) {

      const command = match[1];

      const category = match[2].trim();

      if (!categories[category]) categories[category] = [];

      categories[category].push(command);

    }

    // 🎯 BANNIÈRE PRINCIPALE (plus équilibrée)

    let menu = 

"╔══════════════════════╗\n" +

"║      *AKANE MD*      ║\n" +

"╚══════════════════════╝\n\n" +

"━━━━━━━━━━━━━━━━━━━━━━\n\n" +

`👤 UTILISATEUR  : ${stylizedChar(userName)}\n` +

`🔰 PREFIXE      : ${prefix}\n` +

`📦 VERSION      : 1.0.0\n` +

`⏱️ UPTIME       : ${uptime}\n` +

`💾 RAM          : ${usedRam}/${totalRam} MB\n` +

`💻 PLATEFORME   : ${platform}\n` +

`📅 DATE         : ${day} ${date}\n\n` +

"━━━━━━━━━━━━━━━━━━━━━━\n\n";

    // Ajout des catégories avec bordures stylisées (corrigées)

    for (const [category, commands] of Object.entries(categories)) {

      const icon = getCategoryIcon(category);

      const border = getCategoryBorder(category);

      

      // Titre de catégorie avec bordure (sans répétition d'icône)

      menu += `╭── ${icon} ${border} ──╮\n`;

      menu += `│\n`;

      

      // Commandes en minuscules originales (pas en majuscules forcées)

      commands.forEach(cmd => {

        menu += `│   ✦ ${stylizedChar(cmd)}\n`;

      });

      

      menu += `╰───────────────────╯\n\n`;

    }

    // FOOTER avec DEV et COPYRIGHT (simplifié et élégant)

    menu += 

"━━━━━━━━━━━━━━━━━━━━━━\n\n" +

"╭─────────────────────╮\n" +

"│     👨‍💻 DEV INFO     │\n" +

"╰─────────────────────╯\n" +

`✦ 🍁AKANE KUROGAWAʕ◕ᴥ◕ʔ🌹\n\n` +

"╭─────────────────────╮\n" +

"│    © AKANE-MD 🌹    │\n" +

"╰─────────────────────╯";

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

            isForwarded: true,

            forwardingScore: 999

          }

        });

      } else {

        await client.sendMessage(

          remoteJid,

          {

            video: { url: "database/DigiX.mp3" },

            caption: stylizedChar(menu),

            contextInfo: {

              forwardingScore: 999,

              isForwarded: true

            }

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