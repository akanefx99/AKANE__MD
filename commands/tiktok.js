import axios from 'axios';

// 🔗 LIEN DE TA CHAÎNE WHATSAPP

const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbBzhyQ4NVisPH1NSe1R';

async function tiktokCommand(client, message) {

    try {

        const remoteJid = message.key?.remoteJid;

        const messageBody = message.message?.extendedTextMessage?.text || message.message?.conversation || '';

        const args = messageBody.slice(7).trim();

        

        if (!args || !args.includes('tiktok.com')) {

            await client.sendMessage(remoteJid, { 

                text: " ❌ Envoie un lien TikTok !"

            });

            return;

        }

        await client.sendMessage(remoteJid, { 

            text: " ⏳ Téléchargement..."

        });

        // API TikWM

        const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(args)}`;

        const response = await axios.get(apiUrl, { timeout: 10000 });

        

        if (response.data && response.data.data) {

            const videoUrl = response.data.data.play;

            const title = response.data.data.title || 'TikTok Video';

            const author = response.data.data.author?.unique_id || 'Inconnu';

            

            const videoResponse = await axios.get(videoUrl, { 

                responseType: 'arraybuffer'

            });

            

            const videoBuffer = Buffer.from(videoResponse.data);

            // ✅ DESIGN INSPIRÉ DE TON IMAGE

            const caption = 

                "╔══════════════════╗\n" +

                "    🎬 *TIKTOK DOWNLOAD*  \n" +

                "╚══════════════════╝\n\n" +

                "━━━━━━━━━━━━━━━━━━━\n\n" +

                "📌 *Titre*  \n" +

                `⤷ ${title}\n\n` +

                "👤 *Auteur*  \n" +

                `⤷ @${author}\n\n` +

                "📥 *Statut*  \n" +

                "⤷ *Téléchargé ✓*\n\n" +

                "━━━━━━━━━━━━━━━━━━━\n\n" +

                "> *𝐃𝐄𝐕 : 𝐀𝐊𝐀𝐍𝐄 𝐊𝐔𝐑𝐎𝐆𝐀𝐖𝐀*\n\n" +

                "*Voir la chaîne* 🔥\n\n" +

                `${CHANNEL_LINK}\n\n` +

                "━━━━━━━━━━━━━━━━━━━\n" +

                "\n\n" +

                "╔══════════════════╗\n" +

                "  *_© 𝐀𝐊𝐀𝐍𝐄-𝐌𝐃 🌹_*  \n" +

                "╚══════════════════╝";

            // ✅ Envoyer la vidéo avec la caption

            await client.sendMessage(remoteJid, { 

                video: videoBuffer,

                caption: caption

            });

            

            return;

        }

    } catch (error) {

        console.error('Erreur:', error);

        await client.sendMessage(message.key?.remoteJid, { 

            text: " ❌ Erreur"

        });

    }

}

export default tiktokCommand;
