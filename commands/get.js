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

                filesList = fs.readdirSync(commandsDir)

                    .filter(file => file.endsWith('.js'))

                    .map(file => `• ${file}`)

            } catch (err) {

                console.error('❌ Erreur lecture dossier:', err)

            }

            

            const filesText = filesList.join('\n')

            

            return await client.sendMessage(remoteJid, { 

                text: `❌ Veuillez spécifier un fichier !\n\n📁 *Fichiers disponibles (${filesList.length}):*\n${filesText}\n\nExemple: *.get tt.js*` 

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

                filesList = fs.readdirSync(commandsDir)

                    .filter(file => file.endsWith('.js'))

                    .map(file => `• ${file}`)

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

        // === ENVOI DU FICHIER EN PIÈCE JOINTE ===

        await client.sendMessage(remoteJid, { 

            document: fs.readFileSync(filePath),

            fileName: safeFileName,

            mimetype: 'application/javascript',

            caption: `📎 *Fichier joint : ${safeFileName}*`

        })

        // Petit délai entre les deux envois

        await new Promise(resolve => setTimeout(resolve, 1000))

        // === ENVOI DU CODE DANS LE CHAT ===

        const header = `📄 *CODE : ${safeFileName}*\n\n` +

                      `📊 *Taille : ${(stats.size / 1024).toFixed(2)} KB*\n` +

                      `🕒 *Modifié : ${stats.mtime.toLocaleString()}*\n\n`

        const maxLength = 64000 // 64KB max pour WhatsApp

        const fullContent = header + '```js\n' + fileContent + '\n```'

        

        if (fullContent.length > maxLength) {

            // Envoyer d'abord l'en-tête

            await client.sendMessage(remoteJid, { 

                text: `📄 *${safeFileName}*\n📊 *${(stats.size / 1024).toFixed(2)} KB*\n📦 *Code trop long, envoi en plusieurs parties...*` 

            })

            

            // Envoyer le code par morceaux

            const chunkSize = 60000

            const chunks = Math.ceil(fileContent.length / chunkSize)

            

            for (let i = 0; i < chunks; i++) {

                const start = i * chunkSize

                const end = Math.min((i + 1) * chunkSize, fileContent.length)

                const chunk = fileContent.substring(start, end)

                

                await client.sendMessage(remoteJid, { 

                    text: `\`\`\`js\n// Partie ${i + 1}/${chunks}\n${chunk}\n\`\`\`` 

                })

                

                await new Promise(resolve => setTimeout(resolve, 500))

            }

        } else {

            // Envoyer tout d'un coup

            await client.sendMessage(remoteJid, { 

                text: header + '```js\n' + fileContent + '\n```' 

            })

        }

        // Message de confirmation

        await client.sendMessage(remoteJid, { 

            text: `✅ *${safeFileName}* envoyé avec succès (fichier + code)` 

        })

    } catch (error) {

        console.error('❌ Erreur dans get.js:', error)

        await client.sendMessage(message.key.remoteJid, { 

            text: `❌ Erreur: ${error.message}` 

        })

    }

}