📄 *CODE : get.js*
🎮 *Commande(s) :* get

📊 *Taille : 10.85 KB*
🕒 *Modifié : 3/19/2026, 2:22:19 PM*

```js
import fs from 'fs'

import path from 'path'

import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

export default async function get(client, message, args) {

    try {

        const remoteJid = message.key.remoteJid

        

        // Récupérer le message complet

        const fullMessage = message.message?.conversation || 

                           message.message?.extendedTextMessage?.text || 

                           ''

        

        // Extraire le nom du fichier

        const parts = fullMessage.trim().split(/\s+/)

        let fileName = null

        

        if (parts.length >= 2) {

            fileName = parts[1]

        } else if (args && args.length > 0) {

            fileName = args[0]

        }

        

        // Définir le dossier des commandes

        const commandsDir = path.join(__dirname, '../commands')

        // Si aucun fichier n'est spécifié

        if (!fileName) {

            let filesList = []

            try {

                // Lire tous les fichiers .js

                const files = fs.readdirSync(commandsDir)

                    .filter(file => file.endsWith('.js'))

                    .sort()

                

                // Pour chaque fichier, extraire le nom de la commande

                filesList = files.map(file => {

                    // Enlever l'extension .js

                    const baseName = file.replace('.js', '')

                    

                    // Cas spéciaux pour certains fichiers

                    let commandName = baseName

                    

                    // Mapping des noms de fichiers vers commandes

                    const commandMap = {

                        'group': 'kick/promote/demote/mute/...',

                        'block': 'block/unblock',

                        'sudo': 'sudo/delsudo',

                        'tag': 'tag/tagall/tagadmin',

                        'pp': 'setpp/getpp',

                        'media': 'photo/toaudio',

                        'set': 'setprefix/public/autotype/...',

                        'premiums': 'addprem/delprem',

                        'reactions': 'autoreact',

                        'viewonce': 'vv',

                        'uptade': 'uptade',

                        'all': 'multi-commandes'

                    }

                    

                    // Vérifier si c'est un cas spécial

                    if (commandMap[baseName]) {

                        commandName = commandMap[baseName]

                    } else if (baseName === 'tt') {

                        commandName = 'tt/tictactoe/morpion'

                    } else if (baseName === 'fuck') {

                        commandName = 'fuck'

                    } else if (baseName === 'bible') {

                        commandName = 'bible'

                    } else if (baseName === 'insults') {

                        commandName = 'insulte'

                    } else if (baseName === 'akane') {

                        commandName = 'akane'

                    }

                    

                    return `• ${file} (${commandName})`

                })

                

            } catch (err) {

                console.error('❌ Erreur lecture dossier:', err)

            }

            

            const filesText = filesList.join('\n')

            

            return await client.sendMessage(remoteJid, { 

                text: `❌ Veuillez spécifier un fichier !\n\n📁 *Fichiers disponibles (${filesList.length}):*\n${filesText}\n\n📝 *Exemple:* _.get tt.js_\n🎯 *Pour voir le code du jeu morpion*` 

            })

        }

        // Sécurité

        if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {

            return await client.sendMessage(remoteJid, { 

                text: '❌ Nom de fichier invalide !' 

            })

        }

        // S'assurer que le fichier a l'extension .js

        const safeFileName = fileName.endsWith('.js') ? fileName : `${fileName}.js`

        // Construire le chemin complet

        const filePath = path.join(commandsDir, safeFileName)

        // Vérifier si le fichier existe

        if (!fs.existsSync(filePath)) {

            let filesList = []

            try {

                const files = fs.readdirSync(commandsDir)

                    .filter(file => file.endsWith('.js'))

                    .sort()

                

                filesList = files.map(file => {

                    const baseName = file.replace('.js', '')

                    let commandName = baseName

                    

                    const commandMap = {

                        'group': 'kick/promote/demote/mute/...',

                        'block': 'block/unblock',

                        'sudo': 'sudo/delsudo',

                        'tag': 'tag/tagall/tagadmin',

                        'pp': 'setpp/getpp',

                        'media': 'photo/toaudio',

                        'set': 'setprefix/public/autotype/...',

                        'premiums': 'addprem/delprem',

                        'reactions': 'autoreact',

                        'viewonce': 'vv',

                        'uptade': 'uptade',

                        'all': 'multi-commandes'

                    }

                    

                    if (commandMap[baseName]) {

                        commandName = commandMap[baseName]

                    } else if (baseName === 'tt') {

                        commandName = 'tt/tictactoe/morpion'

                    } else if (baseName === 'fuck') {

                        commandName = 'fuck'

                    } else if (baseName === 'bible') {

                        commandName = 'bible'

                    } else if (baseName === 'insults') {

                        commandName = 'insulte'

                    } else if (baseName === 'akane') {

                        commandName = 'akane'

                    }

                    

                    return `• ${file} (${commandName})`

                })

            } catch (err) {

                console.error('❌ Erreur lecture dossier:', err)

            }

            

            const filesText = filesList.join('\n')

            

            return await client.sendMessage(remoteJid, { 

                text: `❌ Le fichier *${safeFileName}* n'existe pas !\n\n📁 *Fichiers disponibles (${filesList.length}):*\n${filesText}` 

            })

        }

        // Vérifier si c'est un fichier

        const stats = fs.statSync(filePath)

        if (!stats.isFile()) {

            return await client.sendMessage(remoteJid, { 

                text: `❌ *${safeFileName}* n'est pas un fichier valide !` 

            })

        }

        // Lire le contenu du fichier

        const fileContent = fs.readFileSync(filePath, 'utf-8')

        // Extraire le nom de la commande pour l'afficher

        const baseName = safeFileName.replace('.js', '')

        let commandDisplay = baseName

        

        const commandMap = {

            'group': 'kick, promote, demote, mute, unmute, gclink, antilink, bye',

            'block': 'block, unblock',

            'sudo': 'sudo, delsudo',

            'tag': 'tag, tagall, tagadmin',

            'pp': 'setpp, getpp',

            'media': 'photo, toaudio',

            'set': 'setprefix, public, autotype, autorecord, welcome',

            'premiums': 'addprem, delprem',

            'reactions': 'autoreact',

            'viewonce': 'vv',

            'uptade': 'uptade',

            'all': 'multi-commandes (tiktok, parler, traduit, restart, silence, api, bible, insults, apis, akane)'

        }

        

        if (commandMap[baseName]) {

            commandDisplay = commandMap[baseName]

        } else if (baseName === 'tt') {

            commandDisplay = 'tt, tictactoe, morpion'

        }

        // === 1. ENVOI DU FICHIER EN PIÈCE JOINTE ===

        try {

            await client.sendMessage(remoteJid, { 

                document: { url: filePath },

                fileName: safeFileName,

                mimetype: 'application/javascript',

                caption: `📎 *Fichier : ${safeFileName}*\n🎮 *Commande(s) :* ${commandDisplay}`

            })

            console.log('✅ Fichier envoyé avec succès')

        } catch (err) {

            console.error('❌ Erreur envoi fichier:', err)

            await client.sendMessage(remoteJid, { 

                text: `⚠️ Impossible d'envoyer le fichier, mais voici le code :` 

            })

        }

        await new Promise(resolve => setTimeout(resolve, 1500))

        // === 2. ENVOI DU CODE DANS LE CHAT ===

        try {

            const header = `📄 *CODE : ${safeFileName}*\n` +

                          `🎮 *Commande(s) :* ${commandDisplay}\n\n` +

                          `📊 *Taille : ${(stats.size / 1024).toFixed(2)} KB*\n` +

                          `🕒 *Modifié : ${stats.mtime.toLocaleString()}*\n\n`

            const maxLength = 64000

            const fullContent = header + '```js\n' + fileContent + '\n```'

            

            if (fullContent.length > maxLength) {

                await client.sendMessage(remoteJid, { 

                    text: `📄 *${safeFileName}*\n🎮 *${commandDisplay}*\n📊 *${(stats.size / 1024).toFixed(2)} KB*\n📦 *Code trop long, envoi en plusieurs parties...*` 

                })

                

                const chunkSize = 60000

                const chunks = Math.ceil(fileContent.length / chunkSize)

                

                for (let i = 0; i < chunks; i++) {

                    const start = i * chunkSize

                    const end = Math.min((i + 1) * chunkSize, fileContent.length)

                    const chunk = fileContent.substring(start, end)

                    

                    await client.sendMessage(remoteJid, { 

                        text: `\`\`\`js\n// ${safeFileName} - Partie ${i + 1}/${chunks}\n${chunk}\n\`\`\`` 

                    })

                    

                    await new Promise(resolve => setTimeout(resolve, 800))

                }

            } else {

                await client.sendMessage(remoteJid, { 

                    text: header + '```js\n' + fileContent + '\n```' 

                })

            }

            console.log('✅ Code envoyé avec succès')

        } catch (err) {

            console.error('❌ Erreur envoi code:', err)

        }

        // === 3. MESSAGE DE CONFIRMATION ===

        await client.sendMessage(remoteJid, { 

            text: `✅ *${safeFileName}* envoyé avec succès !\n🎮 *Commandes :* ${commandDisplay}` 

        })

    } catch (error) {

        console.error('❌ Erreur générale:', error)

        await client.sendMessage(message.key.remoteJid, { 

            text: `❌ Erreur: ${error.message}` 

        })

    }

}
```