import configmanager from "../utils/configmanager.js"

import fs from 'fs/promises'
import get from '../commands/get.js'

import group from '../commands/group.js'

import block from '../commands/block.js'

import viewonce from '../commands/viewonce.js'

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

async function handleIncomingMessage(client, event) {

    let lid = client?.user?.lid.split(':')[0] + '@lid'

    const number = client.user.id.split(':')[0]

    const messages = event.messages

    const publicMode = configmanager.config.users[number].publicMode

    const prefix = configmanager.config.users[number].prefix

    const premium = configmanager.config.premium || [] // AJOUTÉ

    for (const message of messages) {

        const messageBody = (message.message?.extendedTextMessage?.text ||

                           message.message?.conversation || '').toLowerCase()

        const remoteJid = message.key.remoteJid

        const approvedUsers = configmanager.config.users[number].sudoList || [] // AJOUTÉ

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
                    
          case 'get':

    await react(client, message)

    await get(client, message, args)  // Les args sont passés ici

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

                case 'join': // @cat: group

                    await react(client, message)

                    await group.setJoin(client, message)

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