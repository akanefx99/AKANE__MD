import axios from 'axios';

// 🔗 LIEN DE TA CHAÎNE WHATSAPP

const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbBzhyQ4NVisPH1NSe1R';

// 🔑 TES CLÉS API GEMINI

const GEMINI_KEYS = [

    'AIzaSyCEEUYWB8xkHEbyJ1sGdTgwoMhRSfAZJtc',

    'AIzaSyDiC12aXmjryKyh7ZJbnHE0cChilon1-Vs'

];

const MODELS = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash'];

// Messages d'attente aléatoires

const waitingMessages = [

    "😒 *𝗟𝗼𝘀𝗲𝗿, 𝗽𝗮𝘁𝗶𝗲𝗻𝘁𝗲 𝘂𝗻 𝗽𝗲𝘂...*",

    "🙄 *𝗧𝘂 𝗽𝗲𝘂𝘅 𝗮𝘁𝘁𝗲𝗻𝗱𝗿𝗲 𝗰𝗼𝗺𝗺𝗲 𝘁𝗼𝘂𝘁 𝗹𝗲 𝗺𝗼𝗻𝗱𝗲, 𝗻𝗼𝗻 ?*",

    "😤 *𝗝'𝗮𝗶 𝗽𝗮𝘀 𝗾𝘂𝗲 ç𝗮 𝗮̀ 𝗳𝗮𝗶𝗿𝗲, 𝗽𝗮𝘁𝗶𝗲𝗻𝗰𝗲...*",

    "🤨 *𝗘𝗵 𝘁'𝗲𝘀 𝗽𝗿𝗲𝘀𝘀é 𝗼𝘂 𝗾𝘂𝗼𝗶 ? 𝗖̧𝗮 𝘃𝗲𝗻𝘁...*",

    "😏 *𝗟𝗲𝘀 𝗺𝗲𝗶𝗹𝗹𝗲𝘂𝗿𝗲𝘀 𝗰𝗵𝗼𝘀𝗲𝘀 𝗮𝗿𝗿𝗶𝘃𝗲𝗻𝘁 𝗮̀ 𝗰𝗲𝘂𝘅 𝗾𝘂𝗶 𝘀𝗮𝘃𝗲𝗻𝘁 𝗮𝘁𝘁𝗲𝗻𝗱𝗿𝗲... 𝗱𝗼𝗻𝗰 𝗮𝘁𝘁𝗲𝗻𝗱𝘀.*",

    "😴 *𝗭𝗭𝗭... 𝗢𝗵 𝘁'𝗲𝘀 𝗲𝗻𝗰𝗼𝗿𝗲 𝗹𝗮̀ ? 𝗣𝗮𝘁𝗶𝗲𝗻𝘁𝗲...*",

    "🤔 *𝗛𝗺𝗺𝗺 𝗷𝗲 𝗰𝗵𝗲𝗿𝗰𝗵𝗲 𝘂𝗻𝗲 𝗶𝗻𝘀𝘂𝗹𝘁𝗲 𝗱𝗲 𝗾𝘂𝗮𝗹𝗶𝘁é 𝗽𝗼𝘂𝗿 𝘁𝗼𝗶...*",

    "😎 *𝗖̧𝗮 𝘃𝗶𝗲𝗻𝘁, 𝗰𝗮𝗹𝗺𝗲-𝘁𝗼𝗶 𝗼𝘂 𝗷𝗲 𝘃𝗮𝗶𝘀 𝘃𝗿𝗮𝗶𝗺𝗲𝗻𝘁 𝗺'𝗲́𝗻𝗲𝗿𝘃𝗲𝗿.*"

];

// Fonction pour convertir en police grasse

function convertToBold(text) {

    const boldMap = {

        'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚',

        'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡',

        'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨',

        'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',

        'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴',

        'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻',

        'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂',

        'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',

        '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱',

        '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'

    };

    return text.split('').map(char => boldMap[char] || char).join('');

}

// Fonction pour limiter la longueur

function limitResponse(text, maxLength = 250) {

    if (text.length <= maxLength) return text;

    return text.substring(0, maxLength) + '... [𝗰𝗼𝘂𝗽𝗲́]';

}

async function akaneCommand(client, message) {

    try {

        const remoteJid = message.key?.remoteJid;

        const messageBody = message.message?.extendedTextMessage?.text || message.message?.conversation || '';

        const args = messageBody.slice(7).trim();

        if (!args) {

            const helpMessage = 

                "╔══════════════════╗\n" +

                "    *𝗔𝗞𝗔𝗡𝗘*  \n" +

                "╚══════════════════╝\n\n" +

                "━━━━━━━━━━━━━━━━━━━\n\n" +

                "𝗧'𝗔𝗧𝗧𝗘𝗡𝗗 𝗤𝗨𝗘 𝗝𝗘 𝗧𝗘 𝗗𝗘𝗠𝗔𝗡𝗗𝗘 𝗖𝗘 𝗤𝗨𝗘 𝗧𝗨 𝗩𝗘𝗨𝗫 😒!\n\n" +

                "📌 *𝗘𝘅𝗲𝗺𝗽𝗹𝗲:* `.akane c'est qui le boss ici ?`\n\n" +

                "━━━━━━━━━━━━━━━━━━━\n\n" +

                "> *𝐃𝐄𝐕 : 🍁𝐀𝐊𝐀𝐍𝐄 𝐊𝐔𝐑𝐎𝐆𝐀𝐖𝐀ʕ◕ᴥ◕ʔ🌹*\n\n" +

                "*𝗩𝗢𝗜𝗥 𝗟𝗔 𝗖𝗛𝗔𝗜𝗡𝗘* 🔥\n" +

                `${CHANNEL_LINK}\n\n` +

                "> *_© 𝗔𝗞𝗔𝗡𝗘-𝗠𝗗 🌹_*";

            return await client.sendMessage(remoteJid, { text: helpMessage });

        }

        // Message d'attente aléatoire SANS présentation de la chaîne

        const randomWaiting = waitingMessages[Math.floor(Math.random() * waitingMessages.length)];

        await client.sendMessage(remoteJid, { text: randomWaiting });

        const prompt = `Tu es Akane, une IA insolente et sarcastique. Tu réponds en français de manière impolie mais avec des réponses TRÈS COURTES (maximum 2-3 phrases). Sois méchante mais va droit au but. Question : ${args}`;

        let reply = null;

        let lastError = null;

        for (const apiKey of GEMINI_KEYS) {

            for (const model of MODELS) {

                try {

                    const response = await axios.post(

                        `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`,

                        { contents: [{ parts: [{ text: prompt }] }] },

                        { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }

                    );

                    if (response.data.candidates?.[0]?.content?.parts?.[0]?.text) {

                        reply = response.data.candidates[0].content.parts[0].text;

                        break;

                    }

                } catch (err) {

                    lastError = err;

                    continue;

                }

            }

            if (reply) break;

        }

        if (!reply) throw lastError || new Error('Toutes les APIs ont échoué');

        const limitedReply = limitResponse(reply, 250);

        const boldReply = convertToBold(limitedReply);

        // Message final avec 🍒 pour Akane

        const finalMessage = 

            "╔══════════════════╗\n" +

            "    *𝗔𝗞𝗔𝗡𝗘 𝗥É𝗣𝗢𝗡𝗗*  \n" +

            "╚══════════════════╝\n\n" +

            "━━━━━━━━━━━━━━━━━━━\n\n" +

            `🍒 *𝗔𝗸𝗮𝗻𝗲 :*\n\n${boldReply}\n\n` +

            "━━━━━━━━━━━━━━━━━━━\n\n" +

            "> *𝐃𝐄𝐕 : 🍁𝐀𝐊𝐀𝐍𝐄 𝐊𝐔𝐑𝐎𝐆𝐀𝐖𝐀ʕ◕ᴥ◕ʔ🌹*\n\n" +

            " *𝗩𝗢𝗜𝗥 𝗟𝗔 𝗖𝗛𝗔𝗜𝗡𝗘* 🔥\n" +

            `${CHANNEL_LINK}\n\n` +

            "> *_© 𝗔𝗞𝗔𝗡𝗘-𝗠𝗗 🌹_*";

        await client.sendMessage(remoteJid, { text: finalMessage });

    } catch (error) {

        console.error('Erreur Akane:', error);

        

        const remoteJid = message.key?.remoteJid;

        

        const errorMessage = 

            "╔══════════════════╗\n" +

            "    *𝗘𝗥𝗥𝗘𝗨𝗥 𝗔𝗞𝗔𝗡𝗘*  \n" +

           "╚══════════════════╝\n\n" +

            "━━━━━━━━━━━━━━━━━━━\n\n" +

            "❌ *𝗠ê𝗺𝗲 𝗹𝗲𝘀 𝗺𝗼𝗱è𝗹𝗲𝘀 𝘃𝗲𝘂𝗹𝗲𝗻𝘁 𝗽𝗮𝘀 𝘁𝗲 𝗿é𝗽𝗼𝗻𝗱𝗿𝗲.*\n\n" +

            "📝 *𝗖'𝗲𝘀𝘁 𝗱𝗶𝗿𝗲 𝗮̀ 𝗾𝘂𝗲𝗹 𝗽𝗼𝗶𝗻𝘁 𝘁'𝗲𝘀 𝗿𝗲𝗹𝗼𝘂.*\n\n" +

            "━━━━━━━━━━━━━━━━━━━\n\n" +

            "> *𝐃𝐄𝐕 : 🍁𝐀𝐊𝐀𝐍𝐄 𝐊𝐔𝐑𝐎𝐆𝐀𝐖𝐀ʕ◕ᴥ◕ʔ🌹*\n\n" +

            "> *𝗩𝗢𝗜𝗥 𝗟𝗔 𝗖𝗛𝗔𝗜𝗡𝗘* 🔥" +

            `${CHANNEL_LINK}\n\n` +

            "> *_© 𝗔𝗞𝗔𝗡𝗘-𝗠𝗗 🌹_*";

        await client.sendMessage(remoteJid, { text: errorMessage });

    }

}

export default akaneCommand;