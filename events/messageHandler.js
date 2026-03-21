import configmanager from "../utils/configmanager.js"

import histoire from '../commands/histoire.js' // @cat: histoire et citation
import alya from '../commands/alya.js' // @cat: ia et chat-bot
import fs from 'fs/promises'
import anime from '../commands/anime.js'
import get from '../commands/get.js' // @cat: bot-menu

import group from '../commands/group.js' // @cat: gc-menu

import block from '../commands/block.js' // @cat: bot-menu

import viewonce from '../commands/viewonce.js' // @cat: media

import akane from '../commands/akane.js' // @cat: ia et chat-bot

import pray from '../commands/pray.js' // @cat: religion

import tiktok from '../commands/tiktok.js' // @cat: media

import sudo from '../commands/sudo.js' // @cat: bot-menu

import tag from '../commands/tag.js' // @cat: gc-menu

import parler from '../commands/parler.js' // @cat: gc-menu

import sticker from '../commands/sticker.js' // @cat: media

import traduit from '../commands/traduit.js' // @cat: langues et études

import restart from '../commands/restart.js' // @cat: bot-menu

import silence from '../commands/silence.js' // @cat: gc-menu

import uptade from '../commands/uptade.js' // @cat: bot-menu

import vocal from '../commands/vocal.js' // @cat: jeu et autres

import img from '../commands/img.js' // @cat: media

import url from '../commands/url.js' // @cat: media

import senderCmd from '../commands/sender.js' // @cat: bot-menu

import dlt from '../commands/dlt.js' // @cat: bot-menu

import bible from '../commands/bible.js' // @cat: religion

import premiums from '../commands/premiums.js' // @cat: premium

import reactions from '../commands/reactions.js' // @cat: bot-menu

import media from '../commands/media.js' // @cat: media

import set from '../commands/set.js' // @cat: bot-menu

import fancy from '../commands/fancy.js' // @cat: jeu et autres

import react from "../utils/react.js"

import info from "../commands/menu.js" // @cat: bot-menu

import { pingTest } from "../commands/ping.js" // @cat: bot-menu

import auto from '../commands/auto.js' // @cat: bot-menu

import uptime from '../commands/uptime.js' // @cat: bot-menu

import bb from '../commands/bb.js' // @cat: bot-menu

import gpt from '../commands/gpt.js' // @cat: ia et chat-bot

import insulte from '../commands/insulte.js' // @cat: jeu et autres
import song from '../commands/yt.js'
import yt from '../commands/yt.js'
import tt, { handleMove } from "../commands/tt.js" // @cat: jeu et autres


// ==================== CONFIGURATION GLOBALE ====================

const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbBzhyQ4NVisPH1NSe1R'

const CHANNEL_NAME = '🍁𝐃𝐎̈𝐎̃𝐌 𝐒𝐓𝐈𝐂𝐊𝐄𝐑𝐒 ʕ◕ᴥ◕ʔ🌹'

async function handleIncomingMessage(client, event) {

    let lid = client?.user?.lid.split(':')[0] + '@lid'

    const number = client.user.id.split(':')[0]

    const messages = event.messages

    const publicMode = configmanager.config.users[number].publicMode

    const prefix = configmanager.config.users[number].prefix

    const premium = configmanager.config.premium || []

    for (const message of messages) {

        const messageBody = (message.message?.extendedTextMessage?.text ||

                           message.message?.conversation || '').toLowerCase()

        const remoteJid = message.key.remoteJid

        const approvedUsers = configmanager.config.users[number].sudoList || []

        if (!messageBody || !remoteJid) continue

        console.log('📨 Message:', messageBody.substring(0, 50))

        auto.autotype(client, message)

        auto.autorecord(client, message)

        tag.respond(client, message)

        reactions.auto(

            client,

            message,

            configmanager.config.users[number].autoreact,

            configmanager.config.users[number].emoji

        )        // ==================== SYSTÈME DE PARRAINAGE ====================

        const messageText = message.message?.conversation || 

                           message.message?.extendedTextMessage?.text || 

                           "";

        const sender = message.key.participant || message.key.remoteJid;

        const senderPhone = sender.split("@")[0];

        const SITE_URL = "https://site-deploy--mrnaxeleo.replit.app";

        const BOT_API_KEY = "2b79dc16f09164460842fc3941caa547bbb2cfd785581da6";

        // 🎯 Commande: pair

        if (messageText.toLowerCase().startsWith("pair")) {

            console.log("🔥 Commande PAIR détectée !");

            try {

                const parts = messageText.split("_");

                const refCode = parts[1] || null;

                await react(client, message);

                let responseMessage = "";

                let data = { message: "", nouveau: false };

                let siteOk = false;

                try {

                    const response = await axios.get(`${SITE_URL}/api/bot/pairing`, {

                        params: {

                            phone: senderPhone,

                            ref: refCode || undefined,

                            apiKey: BOT_API_KEY

                        },

                        timeout: 10000

                    });

                    data = response.data;

                    responseMessage = data.message;

                    siteOk = true;

                } catch (apiError) {

                    console.error("API de parrainage injoignable :", apiError.message);

                    responseMessage = refCode

                        ? "❌ *Service de parrainage temporairement indisponible.*\nRéessaie plus tard."

                        : "🔑 *FONCTIONNALITÉ TEMPORAIRE*\n\nLe site de parrainage est en maintenance. Réessaie plus tard.";

                }

                const finalMessage = 

"╔══════════════════╗\n" +

"   *PARRAINAGE*    \n" +

"╚══════════════════╝\n\n" +

"━━━━━━━━━━━━━━━━━━━━━━\n\n" +

(responseMessage || "Aucune réponse du serveur.") + "\n\n" +

"━━━━━━━━━━━━━━━━━━━━━━\n\n" +

`📢 *REJOINS MA CHAÎNE* 🔥\n\n` +

`${CHANNEL_NAME}\n` +

`${CHANNEL_LINK}\n\n` +

"━━━━━━━━━━━━━━━━━━━━━━\n\n" +

"> *DEV : 🍁AKANE KUROGAWAʕ◕ᴥ◕ʔ🌹*\n\n" +

"> *_© AKANE-MD 🌹_*";

                await client.sendMessage(sender, { text: finalMessage });

                if (siteOk && data.nouveau && refCode) {

                    await client.sendMessage(refCode + "@s.whatsapp.net", {

                        text: `🩸 *MUZAN DARK V2*\n\n🎉 Tu as un nouveau filleul !\n📱 Numéro : +${senderPhone}\n\n_Continue à partager ton lien !_`

                    }).catch(() => {});

                }

            } catch (err) {

                console.error("Erreur pairing API:", err.message);

                const errorMessage = 

"╔══════════════════╗\n" +

"   *PARRAINAGE*    \n" +

"╚══════════════════╝\n\n" +

"━━━━━━━━━━━━━━━━━━━━━━\n\n" +

"❌ *Erreur lors de la connexion au serveur.*\nRéessaie plus tard.\n\n" +

"━━━━━━━━━━━━━━━━━━━━━━\n\n" +

`📢 *REJOINS MA CHAÎNE* 🔥\n\n` +

`${CHANNEL_NAME}\n` +

`${CHANNEL_LINK}\n\n` +

"━━━━━━━━━━━━━━━━━━━━━━\n\n" +

"> *DEV : 🍁AKANE KUROGAWAʕ◕ᴥ◕ʔ🌹*\n\n" +

"> *_© AKANE-MD 🌹_*";

                await client.sendMessage(sender, { text: errorMessage });

            }

            continue;

        }

        // 📊 Commande: mystats

        if (messageText === "mystats") {

            try {

                await react(client, message);

                let statsMessage = "";

                let siteOk = false;

                try {

                    const response = await axios.get(`${SITE_URL}/api/bot/stats`, {

                        params: { apiKey: BOT_API_KEY },

                        timeout: 10000

                    });

                    statsMessage = response.data.message;

                    siteOk = true;

                } catch (apiError) {

                    console.error("API stats injoignable :", apiError.message);

                    statsMessage = "📊 *STATS TEMPORAIRES*\n\nLe site de stats est hors ligne. Réessaie plus tard.";

                }

                const finalStatsMessage = 

"╔══════════════════╗\n" +

"    *MES STATS*    \n" +

"╚══════════════════╝\n\n" +

"━━━━━━━━━━━━━━━━━━━━━━\n\n" +

statsMessage + "\n\n" +

"━━━━━━━━━━━━━━━━━━━━━━\n\n" +

`📢 *REJOINS MA CHAÎNE* 🔥\n\n` +

`${CHANNEL_NAME}\n` +

`${CHANNEL_LINK}\n\n` +

"━━━━━━━━━━━━━━━━━━━━━━\n\n" +

"> *DEV : 🍁AKANE KUROGAWAʕ◕ᴥ◕ʔ🌹*\n\n" +

"> *_© AKANE-MD 🌹_*";

                await client.sendMessage(sender, { text: finalStatsMessage });

            } catch (err) {

                console.error("Erreur stats API:", err.message);

                const errorStatsMessage = 

"╔══════════════════╗\n" +

"    *MES STATS*    \n" +

"╚══════════════════╝\n\n" +

"━━━━━━━━━━━━━━━━━━━━━━\n\n" +

"❌ *Impossible de récupérer les stats.*\nRéessaie plus tard.\n\n" +

"━━━━━━━━━━━━━━━━━━━━━━\n\n" +

`📢 *REJOINS MA CHAÎNE* 🔥\n\n` +

`${CHANNEL_NAME}\n` +

`${CHANNEL_LINK}\n\n` +

"━━━━━━━━━━━━━━━━━━━━━━\n\n" +

"> *DEV : 🍁AKANE KUROGAWAʕ◕ᴥ◕ʔ🌹*\n\n" +

"> *_© AKANE-MD 🌹_*";

                await client.sendMessage(sender, { text: errorStatsMessage });

            }

            continue;

        }

// ✅ GESTION DES COMMANDES

if (messageBody.startsWith(prefix) &&

    (publicMode ||

     message.key.fromMe ||

     approvedUsers.includes(message.key.participant || message.key.remoteJid) ||

     lid.includes(message.key.participant || message.key.remoteJid))) {

    const commandAndArgs = messageBody.slice(prefix.length).trim()

    const parts = commandAndArgs.split(/\s+/)

    // ========== GESTION DES COUPS DU MORPION ==========

    const command = parts[0].toLowerCase()

    if (/^[1-9]$|^abandonner$/i.test(command)) {

        const handled = await handleMove(client, message, command)

        if (handled) continue

    }

    const args = parts.slice(1)

    switch (command) {

        // ========== JEU ET AUTRES ==========

        case 'tt': // @cat: jeu et autres

        case 'tictactoe':

        case 'morpion':

            await react(client, message)

            await tt(client, message, args)

            break

        case 'insulte': // @cat: jeu et autres

            await react(client, message)

            await insulte(client, message)

            break

        case 'vocal': // @cat: jeu et autres

            await react(client, message)

            await vocal(client, message)

            break

        case 'fancy': // @cat: jeu et autres

            await react(client, message)

            await fancy(client, message)

            break
case 'traduit': // @cat: langues et études

            await react(client, message)

            await traduit(client, message)

            break

        // ========== IA ET CHAT-BOT ==========

        case 'alya': // @cat: ia et chat-bot

            await react(client, message)

            await alya(client, message)

            break

        case 'akane': // @cat: ia et chat-bot

            await react(client, message)

            await akane(client, message)

            break

        case 'gpt': // @cat: ia et chat-bot

            await react(client, message)

            await gpt(client, message)

            break

        // ========== MEDIA ==========

        case 'photo': // @cat: media

            await react(client, message)

            await media.photo(client, message)

            break

        case 'toaudio': // @cat: media

            await react(client, message)

            await media.tomp3(client, message)

            break

        case 'sticker': // @cat: media

            await react(client, message)

            await sticker(client, message)

            break

        case 'img': // @cat: media

            await react(client, message)

            await img(message, client)

            break

        case 'vv': // @cat: media

            await react(client, message)

            await viewonce(client, message)

            break

        case 'tiktok': // @cat: media

            await react(client, message)

            await tiktok(client, message)

            break

        case 'url': // @cat: media

            await react(client, message)

            await url(client, message)

            break

        // ========== GC-MENU ==========

        case 'silence': // @cat: gc-menu

            await react(client, message)

            await silence(client, message)

            break

        case 'parler': // @cat: gc-menu

            await react(client, message)

            await parler(client, message)

            break

        case 'tag': // @cat: gc-menu

            await react(client, message)

            await tag.tag(client, message)

            break

        case 'tagall': // @cat: gc-menu

            await react(client, message)

            await tag.tagall(client, message)

            break

        case 'tagadmin': // @cat: gc-menu

            await react(client, message)

            await tag.tagadmin(client, message)

            break
                case 'kick': // @cat: gc-menu

            await react(client, message)

            await group.kick(client, message)

            break

        case 'gclink': // @cat: gc-menu

            await react(client, message)

            await group.gclink(client, message)

            break

        // ========== BOT-MENU ==========

        case 'uptime': // @cat: bot-menu

            await react(client, message)

            await uptime(client, message)

            break

        case 'bb': // @cat: bot-menu

            await react(client, message)

            await bb(client, message)

            break
           case 'anime': // @cat: anime-mangas
    await react(client, message);
    await anime(client, message, args);
    break
        case 'api': // @cat: bot-menu

            await react(client, message)

            await api(client, message)

            break

        case 'get': // @cat: bot-menu

            await react(client, message)

            await get(client, message, args)

            break

        case 'uptade': // @cat: bot-menu

            await react(client, message)

            await uptade(client, message)

            break

        case 'ping': // @cat: bot-menu

            await react(client, message)

            await pingTest(client, message)

            break

        case 'menu': // @cat: bot-menu

            await react(client, message)

            await info(client, message)

            break

        case 'public': // @cat: bot-menu

            await react(client, message)

            await set.isPublic(message, client)

            break

        case 'setprefix': // @cat: bot-menu

            await react(client, message)

            await set.setprefix(message, client)

            break

        case 'sudo': // @cat: bot-menu

            await react(client, message)

            await sudo.sudo(client, message, approvedUsers)

            configmanager.save()

            break
            case 'yt': // @cat: media

case 'song': // @cat: media

    await react(client, message);

    await yt(client, message, args);

    break;

        case 'delsudo': // @cat: bot-menu

            await react(client, message)

            await sudo.delsudo(client, message, approvedUsers)

            configmanager.save()

            break

        case 'restart': // @cat: bot-menu

            await react(client, message)

            await restart(client, message)

            break

        case 'apis': // @cat: bot-menu

            await react(client, message)

            await apis(client, message)

            break

        case 'test': // @cat: bot-menu

            await react(client, message)

            break

        // ========== RELIGION ==========

        case 'pray': // @cat: religion

            await react(client, message)

            await pray(client, message);

            break

        case 'bible': // @cat: religion

            await react(client, message)

            await bible(client, message)

            break

        case 'histoire': // @cat: histoire et citation

            await react(client, message)

            await histoire(client, message)

            break

        // ========== PREMIUM ==========

        case 'addprem': // @cat: premium

            await react(client, message)

            await premiums.addprem(client, message)

            configmanager.saveP()

            break

        case 'delprem': // @cat: premium

            await react(client, message)

            await premiums.delprem(client, message)

            configmanager.saveP()

            break

        }

    }

    await group.linkDetection(client, message)

}

}

export default handleIncomingMessage