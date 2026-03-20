import configmanager from "../utils/configmanager.js"

import histoire from '../commands/histoire.js'

import fs from 'fs/promises'

import get from '../commands/get.js'

import group from '../commands/group.js'

import block from '../commands/block.js'

import viewonce from '../commands/viewonce.js'

import pray from '../commands/pray.js'

import tiktok from '../commands/all.js'

import sudo from '../commands/sudo.js'

import tag from '../commands/tag.js'

import parler from '../commands/all.js'

import sticker from '../commands/sticker.js'

import traduit from '../commands/all.js'

import restart from '../commands/all.js'

import silence from '../commands/all.js'

import api from '../commands/all.js'

import uptade from '../commands/uptade.js'

import vocal from '../commands/vocal.js'

import img from '../commands/img.js'

import url from '../commands/url.js'

import sender from '../commands/sender.js'

import dlt from '../commands/dlt.js'

import bible from '../commands/all.js'

import pp from '../commands/pp.js'

import premiums from '../commands/premiums.js'

import reactions from '../commands/reactions.js'

import media from '../commands/media.js'

import set from '../commands/set.js'

import fancy from '../commands/fancy.js'

import react from "../utils/react.js"

import info from "../commands/menu.js"

import { pingTest } from "../commands/ping.js"

import auto from '../commands/auto.js'

import uptime from '../commands/uptime.js'

import bb from '../commands/bb.js'

import insults from '../commands/all.js'

import apis from '../commands/all.js'

import akane from '../commands/all.js'

// ========== IMPORT DU JEU MORPION ==========

import tt, { handleMove } from "../commands/tt.js"

// ========== IMPORT POUR LE SYSTÈME DE PARRAINAGE ==========

import axios from 'axios';

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

        )

        // ==================== SYSTÈME DE PARRAINAGE ====================

        const messageText = message.message?.conversation || 

                           message.message?.extendedTextMessage?.text || 

                           "";

        const sender = message.key.participant || message.key.remoteJid;

        const senderPhone = sender.split("@")[0];

        const SITE_URL = "https://muzandark.replit.app";

        const BOT_API_KEY = "2b79dc16f09164460842fc3941caa547bbb2cfd785581da6";

        // 🎯 Commande: pair  ou  pair_CODE

        if (messageText.toLowerCase().startsWith("pair")) {

            try {

                const parts = messageText.split("_");

                const refCode = parts[1] || null;

                await react(client, message);

                let responseMessage = "";

                let data = { message: "", nouveau: false };

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

                } catch (apiError) {

                    console.error("API de parrainage injoignable :", apiError.message);

                    responseMessage = refCode

                        ? "❌ *Service de parrainage temporairement indisponible.*\nRéessaie avec `.pair` pour obtenir ton code."

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

                if (data.nouveau && refCode) {

                    await client.sendMessage(refCode + "@s.whatsapp.net", {

                        text: `🩸 *MUZAN DARK V2*\n\n🎉 Tu as un nouveau filleul !\n📱 Numéro : +${senderPhone}\n\n_Continue à partager ton lien !_`

                    }).catch(() => {});

                }

            } catch (err) {

                console.error("Erreur pairing API:", err.message);

                await client.sendMessage(sender, {

                    text: "❌ Erreur lors de la connexion au serveur. Réessaie plus tard."

                });

            }

            continue;

        }

        // 📊 Commande: mystats

        if (messageText === "mystats") {

            try {

                await react(client, message);

                let statsMessage = "";

                try {

                    const response = await axios.get(`${SITE_URL}/api/bot/stats`, {

                        params: { apiKey: BOT_API_KEY },

                        timeout: 10000

                    });

                    statsMessage = response.data.message;

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

                await client.sendMessage(sender, {

                    text: "❌ Impossible de récupérer les stats. Réessaie plus tard."

                });

            }

            continue;

        }

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

                if (handled) return

            }

            const args = parts.slice(1)

            switch (command) {

                // ========== COMMANDE MORPION ==========

                case 'tt':

                case 'tictactoe':

                case 'morpion':

                    await react(client, message)

                    await tt(client, message, args)

                    break

                case 'uptime': // @cat: utils

                    await react(client, message)

                    await uptime(client, message)

                    break

                case 'bb': // @cat: utils

                    await react(client, message)

                    await bb(client, message)

                    break

                    

                case 'histoire': // @cat: histoire et citation 

                    await react(client, message)

                    await histoire(client, message)

                    break

                case 'akane': // @cat: utils

                    await react(client, message)

                    await akane(client, message)

                    break

                case 'silence': // @cat: utils

                    await react(client, message)

                    await silence(client, message)

                    break

                    

                case 'insulte': // @cat: utils

                    await react(client, message)

                    await insults(client, message)

                    break

                case 'vocal': // @cat: une

                    await react(client, message)

                    await vocal(client, message)

                    break

                case 'api': // @cat: utils

                    await react(client, message)

                    await api(client, message)

                    break

                    

                case 'pray': // @cat: région

                    await react(client, message)

                    await pray(client, message);

                    break

                    

                case 'get':

                    await react(client, message)

                    await get(client, message, args)

                    break          

                    

                case 'uptade': // @cat: utils

                    await react(client, message)

                    await uptade(client, message)

                    break

                case 'ping': // @cat: utils

                    await react(client, message)

                    await pingTest(client, message)

                    break

                case 'menu': // @cat: utils

                    await react(client, message)

                    await info(client, message)

                    break

                case 'fancy': // @cat: utils

                    await react(client, message)

                    await fancy(client, message)

                    break

                case 'setpp': // @cat: utils

                    await react(client, message)

                    await pp.setpp(client, message)

                    break

                case 'parler': // @cat utils

                    await react(client, message)

                    await parler(client, message)

                    break

                case 'getpp': // @cat: utils

                    await react(client, message)

                    await pp.getpp(client, message)

                    break

                case 'sudo': // @cat: owner

                    await react(client, message)

                    await sudo.sudo(client, message, approvedUsers)

                    configmanager.save()

                    break

                case 'delsudo': // @cat: owner

                    await react(client, message)

                    await sudo.delsudo(client, message, approvedUsers)

                    configmanager.save()

                    break

                case 'public': // @cat: settings

                    await react(client, message)

                    await set.isPublic(message, client)

                    break

                case 'setprefix': // @cat: settings

                    await react(client, message)

                    await set.setprefix(message, client)

                    break

                case 'autotype': // @cat: settings

                    await react(client, message)

                    await set.setautotype(message, client)

                    break

                case 'autorecord': // @cat: settings

                    await react(client, message)

                    await set.setautorecord(message, client)

                    break

                case 'welcome': // @cat: settings

                    await react(client, message)

                    await set.setwelcome(message, client)

                    break

                case 'photo': // @cat: media

                    await react(client, message)

                    await media.photo(client, message)

                    break

                case 'toaudio': // @cat: media

                    await react(client, message)

                    await media.tomp3(client, message)

                    break

                case 'traduit': //@cat especial

                    await react(client, message)

                    await traduit(client, message)

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

                case 'bible': // @cat: media

                    await react(client, message)

                    await bible(client, message)

                    break

                case 'apis': // @cat: media

                    await react(client, message)

                    await apis(client, message)

                    break

                case 'restart': // @cat media

                    await react(client, message)

                    await restart(client, message)

                    break

                case 'tiktok': // @cat: media

                    await react(client, message)

                    await tiktok(client, message)

                    break

                case 'url': // @cat: media

                    await react(client, message)

                    await url(client, message)

                    break

                case 'tag': // @cat: group

                    await react(client, message)

                    await tag.tag(client, message)

                    break

                case 'tagall': // @cat: group

                    await react(client, message)

                    await tag.tagall(client, message)

                    break

                case 'tagadmin': // @cat: group

                    await react(client, message)

                    await tag.tagadmin(client, message)

                    break

                case 'kick': // @cat: group

                    await react(client, message)

                    await group.kick(client, message)

                    break

                case 'kickall': // @cat: group

                    await react(client, message)

                    await group.kickall(client, message)

                    break

                case 'kickall2': // @cat: group

                    await react(client, message)

                    await group.kickall2(client, message)

                    break

                case 'promote': // @cat: group

                    await react(client, message)

                    await group.promote(client, message)

                    break

                case 'demote': // @cat: group

                    await react(client, message)

                    await group.demote(client, message)

                    break

                case 'promoteall': // @cat: group

                    await react(client, message)

                    await group.pall(client, message)

                    break

                case 'demoteall': // @cat: group

                    await react(client, message)

                    await group.dall(client, message)

                    break

                case 'mute': // @cat: group

                    await react(client, message)

                    await group.mute(client, message)

                    break

                case 'unmute': // @cat: group

                    await react(client, message)

                    await group.unmute(client, message)

                    break

                case 'gclink': // @cat: group

                    await react(client, message)

                    await group.gclink(client, message)

                    break

                case 'antilink': // @cat: group

                    await react(client, message)

                    await group.antilink(client, message)

                    break

                case 'bye': // @cat: group

                    await react(client, message)

                    await group.bye(client, message)

                    break

                case 'join': // @cat: group

                    await react(client, message)

                    await group.setJoin(client, message)

                    break

                case 'block': // @cat: moderation

                    await react(client, message)

                    await block.block(client, message)

                    break

                case 'unblock': // @cat: moderation

                    await react(client, message)

                    await block.unblock(client, message)

                    break

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

                case 'test': // @cat: creator

                    await react(client, message)

                    break

                case 'auto-promote': // @cat: premium

                    await react(client, message)

                    if (premium.includes(number + "@s.whatsapp.net")) {

                        await group.autoPromote(client, message)

                    }

                    break

                case 'auto-demote': // @cat: premium

                    await react(client, message)

                    if (premium.includes(number + "@s.whatsapp.net")) {

                        await group.autoDemote(client, message)

                    }

                    break

                case 'auto-left': // @cat: premium

                    await react(client, message)

                    if (premium.includes(number + "@s.whatsapp.net")) {

                        await group.autoLeft(client, message)

                    }

                    break

            }

        }

        await group.linkDetection(client, message)

    }

}

export default handleIncomingMessage