import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

// ==================== CONFIGURATION GLOBALE ====================
const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbBzhyQ4NVisPH1NSe1R';
const GEMINI_API_LINK = 'https://aistudio.google.com/app/apikey';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tempDir = path.join(__dirname, '../temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

// ==================== TES 10 CLÉS API GEMINI ====================
const GEMINI_KEYS = [
    'AIzaSyDMydEcpEimrpFpcwdnrJKyMxWrQkguEsI', // ✅ Clé 1
    'AIzaSyB9KD6YTM9qxr8iiu8Fu4FJnU0gxMzJ-k0', // ✅ Clé 2
    'AIzaSyA9kEmfT8NSqbUjIEgxwh6f85_vmBRzXVY', // ✅ Clé 3
    'AIzaSyBxwsQO6cZ2ZsmsQMnGjI0FkcZYJs7jDG4', // ✅ Clé 4
    'AIzaSyD2KTrOESluHLwvmIeKZQ6QuTOAD3vKI-g', // ✅ Clé 5
    'AIzaSyDmfRCakls4f--K-GPfBQT2cCdcN8xiRlU', // ✅ Clé 6
    'AIzaSyDuCeNlm2r9LUVLyFhmPdTSyxHQOULLjlw', // ✅ Clé 7
    'AIzaSyC0WI1B456VbsffV6QQcqAx1_PpBUrA4uY', // ✅ Clé 8
    'AIzaSyD7oZZqU7TpuAkkuFL1i79u3QXxRbK2Qf8', // ✅ Clé 9
    'AIzaSyAx2DaxXfMD4AYHacDuNhklQRd2pdM5860'  // ✅ Clé 10
];

const MODELS = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash'];

// ==================== FONCTIONS UTILITAIRES ====================
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

function limitResponse(text, maxLength = 250) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '... [coupe]';
}

// ==================== COMMANDE API (Vérification des clés) ====================
async function apiCommand(sock, message) {
    try {
        const remoteJid = message.key?.remoteJid;
        await sock.sendMessage(remoteJid, { text: convertToBold("🔍 *Verification des 10 cles API...*") });

        let aliveCount = 0;
        const results = [];

        for (let i = 0; i < GEMINI_KEYS.length; i++) {
            const apiKey = GEMINI_KEYS[i];
            let isAlive = false;
            for (const model of MODELS) {
                try {
                    const response = await axios.post(
                        `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`,
                        { contents: [{ parts: [{ text: "OK" }] }] },
                        { headers: { 'Content-Type': 'application/json' }, timeout: 3000 }
                    );
                    if (response.data.candidates?.[0]?.content?.parts?.[0]?.text) {
                        isAlive = true;
                        break;
                    }
                } catch (err) { continue; }
            }
            if (isAlive) {
                aliveCount++;
                results.push(`✅ Cle ${i + 1}: En vie`);
            } else {
                results.push(`❌ Cle ${i + 1}: Morte`);
            }
        }

        const statusMessage = 
            "╔════════════╗\n" +
            "  *ETAT DES APIS*  \n" +
            "╚════════════╝\n\n" +
            `📊 *${aliveCount}/10 cles en vie*\n\n` +
            results.join('\n') + '\n\n' +
            "> *DEV : 🍁AKANE KUROGAWAʕ◕ᴥ◕ʔ🌹*\n\n" +
            `*VOIR LA CHAINE* 🔥\n${CHANNEL_LINK}`;

        await sock.sendMessage(remoteJid, { text: statusMessage });
    } catch (error) {
        console.error('Erreur apiCommand:', error);
    }
}

// ==================== COMMANDE APIS (Gestion des clés) ====================
function getCurrentKeys() {
    try {
        const gptFilePath = path.join(__dirname, 'gpt.js');
        const content = fs.readFileSync(gptFilePath, 'utf8');
        const match = content.match(/const GEMINI_KEYS = \[([\s\S]*?)\];/);
        if (match) {
            return match[1]
                .split(',')
                .map(key => key.trim().replace(/'/g, '').replace(/\/\/.*$/g, '').trim())
                .filter(key => key && key.startsWith('AIzaSy'));
        }
        return GEMINI_KEYS; // Fallback sur les clés par défaut
    } catch (error) {
        console.error('Erreur lecture clés:', error);
        return GEMINI_KEYS;
    }
}

async function apisCommand(sock, message) {
    try {
        const remoteJid = message.key?.remoteJid;
        const messageBody = message.message?.extendedTextMessage?.text || message.message?.conversation || '';
        const args = messageBody.slice(6).trim().split(' ');

        if (!args[0]) {
            const currentKeys = getCurrentKeys();
            const keysList = currentKeys.map((key, index) => `🔑 *Cle ${index + 1}:* ${key.substring(0, 15)}...`).join('\n');
            const helpMessage = 
                "╔════════════╗\n" +
                "  *GESTION APIS*  \n" +
                "╚════════════╝\n\n" +
                "📋 *Cles actuelles:*\n" + keysList + '\n\n' +
                "📝 `.apis [numero] [nouvelle_cle]`\n\n" +
                "🔗 *Obtenir des cles:*\n" + GEMINI_API_LINK + '\n\n' +
                "> *DEV : 🍁AKANE KUROGAWAʕ◕ᴥ◕ʔ🌹*\n\n" +
                `*VOIR LA CHAINE* 🔥\n${CHANNEL_LINK}`;
            await sock.sendMessage(remoteJid, { text: helpMessage });
            return;
        }

        const keyNumber = parseInt(args[0]);
        const newKey = args[1];

        if (isNaN(keyNumber) || keyNumber < 1 || keyNumber > 10) {
            await sock.sendMessage(remoteJid, { text: "❌ *Numero invalide ! (1-10)*" });
            return;
        }
        if (!newKey || !newKey.startsWith('AIzaSy')) {
            await sock.sendMessage(remoteJid, { text: "❌ *Cle invalide ! (doit commencer par AIzaSy)*" });
            return;
        }

        await sock.sendMessage(remoteJid, { text: `🔄 *Mise a jour cle ${keyNumber}...*` });

        const gptFilePath = path.join(__dirname, 'gpt.js');
        let content = fs.readFileSync(gptFilePath, 'utf8');
        const keyPattern = new RegExp(`('AIzaSy[^']*'|"AIzaSy[^"]*")`, 'g');
        let matchCount = 0;
        content = content.replace(keyPattern, (match) => {
            matchCount++;
            return (matchCount === keyNumber) ? `'${newKey}'` : match;
        });
        fs.writeFileSync(gptFilePath, content, 'utf8');

        const currentKeys = getCurrentKeys();
        const successMessage = 
            "╔════════════╗\n" +
            "  *MISE A JOUR*  \n" +
            "╚════════════╝\n\n" +
            `✅ *Cle ${keyNumber} mise a jour !*\n\n` +
            "📋 *Nouvelles cles:*\n" +
            currentKeys.map((key, i) => 
                i + 1 === keyNumber 
                    ? `✨ Cle ${i + 1}: ${key.substring(0, 20)}... (nouvelle)`
                    : `🔑 Cle ${i + 1}: ${key.substring(0, 15)}...`
            ).join('\n') + '\n\n' +
            "> *DEV : 🍁AKANE KUROGAWAʕ◕ᴥ◕ʔ🌹*\n\n" +
            `*VOIR LA CHAINE* 🔥\n${CHANNEL_LINK}`;
        await sock.sendMessage(remoteJid, { text: successMessage });

    } catch (error) {
        console.error('Erreur apisCommand:', error);
    }
}

// ==================== COMMANDE GPT (AKANE IA) ====================
const waitingMessages = [
    "😒 *Loser, patiente...*",
    "🙄 *Tu peux attendre, non ?*",
    "😤 *J'ai pas que ca a faire...*",
    "🤨 *Eh t'es presse ?*",
    "😏 *Les meilleures choses arrivent...*",
    "😴 *ZZZ... T'es encore la ?*",
    "🤔 *Hmmm...*",
    "😎 *Ca vient, patience...*"
];

async function akaneCommand(sock, message) {
    try {
        const remoteJid = message.key?.remoteJid;
        const messageBody = message.message?.extendedTextMessage?.text || message.message?.conversation || '';
        const args = messageBody.slice(5).trim();

        if (!args) {
            const helpMessage = 
                "╔══════════════════╗\n" +
                "     *AKANE IA*     \n" +
                "╚══════════════════╝\n\n" +
                "T'ATTEND QUE JE TE DEMANDE CE QUE TU VEUX 😒\n\n" +
                "📌 `.gpt c'est qui le boss ?`\n\n" +
                "> *DEV : 🍁AKANE KUROGAWAʕ◕ᴥ◕ʔ🌹*\n\n" +
                `*VOIR LA CHAINE* 🔥\n${CHANNEL_LINK}`;
            return await sock.sendMessage(remoteJid, { text: helpMessage });
        }

        const randomWaiting = waitingMessages[Math.floor(Math.random() * waitingMessages.length)];
        await sock.sendMessage(remoteJid, { text: randomWaiting });

        const prompt = `Tu es Akane, une IA insolente et sarcastique. Reponds en francais de maniere impolie mais avec des reponses TRES COURTES (maximum 2-3 phrases). Sois mechante mais va droit au but. Question : ${args}`;

        let reply = null;
        let lastError = null;

        // Essayer toutes les 10 clés avec tous les modèles
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
                        console.log(`✅ Akane repond avec cle ${apiKey.substring(0, 15)}... modele ${model}`);
                        break;
                    }
                } catch (err) { 
                    lastError = err;
                    continue; 
                }
            }
            if (reply) break;
        }

        if (!reply) throw lastError || new Error('Toutes les APIs ont echoue');

        const limitedReply = limitResponse(reply, 250);
        const boldReply = convertToBold(limitedReply);

        const finalMessage = 
            "╔══════════════════╗\n" +
            "     *AKANE IA*     \n" +
            "╚══════════════════╝\n\n" +
            `🍒 *AKANE :*\n\n${boldReply}\n\n` +
            "> *DEV : 🍁AKANE KUROGAWAʕ◕ᴥ◕ʔ🌹*\n\n" +
            `*VOIR LA CHAINE* 🔥\n${CHANNEL_LINK}`;

        await sock.sendMessage(remoteJid, { text: finalMessage });

    } catch (error) {
        console.error('Erreur gptCommand:', error);
        const errorMessage = 
            "╔══════════════════╗\n" +
            "       *ERREUR*       \n" +
            "╚══════════════════╝\n\n" +
            "❌ *Meme 10 cles Gemini veulent pas repondre.*\n\n" +
            "> *DEV : 🍁AKANE KUROGAWAʕ◕ᴥ◕ʔ🌹*\n\n" +
            `*VOIR LA CHAINE* 🔥\n${CHANNEL_LINK}`;
        await sock.sendMessage(remoteJid, { text: errorMessage });
    }
}

// ==================== COMMANDE RESTART ====================
async function restartCommand(sock, message) {
    try {
        const remoteJid = message.key?.remoteJid;
        const sender = message.key?.participant || remoteJid;
        console.log(`📱 Commande .restart recue de: ${sender}`);

        const restartMessage = 
            "╔════════════╗\n" +
            "  *RESTART*  \n" +
            "╚════════════╝\n\n" +
            "🔄 *Redemarrage en cours...*\n\n" +
            "⏳ *Quelques secondes*\n\n" +
            "> *DEV : 🍁AKANE KUROGAWAʕ◕ᴥ◕ʔ🌹*\n\n" +
            `*VOIR LA CHAINE* 🔥\n${CHANNEL_LINK}`;

        await sock.sendMessage(remoteJid, { text: restartMessage });
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('🔄 Redemarrage du bot...');
        process.exit(0);

    } catch (error) {
        console.error('Erreur restartCommand:', error);
    }
}

// ==================== COMMANDE TIKTOK ====================
async function tiktokCommand(client, message) {
    try {
        const remoteJid = message.key?.remoteJid;
        const messageBody = message.message?.extendedTextMessage?.text || message.message?.conversation || '';
        const args = messageBody.slice(7).trim();

        if (!args || !args.includes('tiktok.com')) {
            await client.sendMessage(remoteJid, { text: "❌ *Envoie un lien TikTok !*" });
            return;
        }

        await client.sendMessage(remoteJid, { text: "⏳ *Telechargement...*" });

        const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(args)}`;
        const response = await axios.get(apiUrl, { timeout: 10000 });

        if (response.data && response.data.data) {
            const videoUrl = response.data.data.play;
            const title = response.data.data.title || 'TikTok Video';
            const author = response.data.data.author?.unique_id || 'Inconnu';

            const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
            const videoBuffer = Buffer.from(videoResponse.data);

            const caption = 
                "╔════════════╗\n" +
                "  🎬 *TIKTOK*  \n" +
                "╚════════════╝\n\n" +
                `📌 *${title}*\n` +
                `👤 @${author}\n` +
                `📥 ✓\n\n` +
                "> *DEV : 🍁AKANE KUROGAWAʕ◕ᴥ◕ʔ🌹*\n\n" +
                `*VOIR LA CHAINE* 🔥\n${CHANNEL_LINK}\n\n` +
                "*_© AKANE-MD 🌹_*";

            await client.sendMessage(remoteJid, { video: videoBuffer, caption: caption });
        }

    } catch (error) {
        console.error('Erreur TikTok:', error);
        await client.sendMessage(message.key?.remoteJid, { text: "❌ *Erreur*" });
    }
}

// ==================== COMMANDE INSULTE ====================
const insults = [
    "T'es comme un nuage. Quand tu disparais, c'est une belle journee !",
    "Tu apportes tellement de joie aux gens... quand tu quittes la piece !",
    "Je serais d'accord avec toi, mais apres on aurait tous les deux tort.",
    "T'es pas bete, t'as juste de la malchance quand tu reflechis.",
    "Tes secrets sont toujours en securite avec moi. Je ne les ecoute meme jamais.",
    "T'es la preuve que meme l'evolution prend des pauses parfois.",
    "T'as un truc sur le menton... non, le troisieme en bas.",
    "T'es comme une mise a jour logicielle. Des que je te vois, je me dis 'J'ai vraiment besoin de ca maintenant ?'",
    "Tu rends tout le monde heureux... tu sais, quand tu t'en vas.",
    "T'es comme une piece de monnaie—deux faces et pas beaucoup de valeur.",
    "T'as quelque chose en tete... oh attends, never mind.",
    "T'es la raison pour laquelle ils mettent des modes d'emploi sur les bouteilles de shampooing.",
    "T'es comme un nuage. Toujours a flotter sans vrai but.",
    "Tes blagues sont comme du lait perime—aigres et difficiles a digerer.",
    "T'es comme une bougie dans le vent... inutile quand les choses deviennent difficiles.",
    "T'as quelque chose d'unique—ta capacite a enerver tout le monde egalement.",
    "T'es comme un signal Wi-Fi—toujours faible quand on a le plus besoin.",
    "T'es la preuve que tout le monde n'a pas besoin d'un filtre pour etre desagreable.",
    "Ton energie est comme un trou noir—elle aspire juste la vie de la piece.",
    "T'as le visage parfait pour la radio.",
    "T'es comme un embouteillage—personne ne te veut, mais te voila.",
    "T'es comme un crayon casse—sans interet.",
    "Tes idees sont tellement originales, je suis sur de les avoir deja toutes entendues.",
    "T'es la preuve vivante que meme les erreurs peuvent etre productives.",
    "T'es pas paresseux, t'es juste tres motive a ne rien faire.",
    "Ton cerveau tourne sous Windows 95—lent et depasse.",
    "T'es comme un ralentisseur—personne ne t'aime, mais tout le monde doit te supporter.",
    "T'es comme un nuage de moustiques—juste irritant.",
    "Tu rassembles les gens... pour parler de a quel point t'es enervant."
];

async function insultCommand(client, message) {
    try {
        const remoteJid = message.key?.remoteJid;
        if (!message || !remoteJid) return;

        let userToInsult;
        if (message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
            userToInsult = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
        } else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
            userToInsult = message.message.extendedTextMessage.contextInfo.participant;
        }

        if (!userToInsult) {
            await client.sendMessage(remoteJid, { text: "👀 *Mentionne quelqu'un !*" });
            return;
        }

        const insult = insults[Math.floor(Math.random() * insults.length)];
        const insultMessage = 
            "╔════════════╗\n" +
            "  *INSULTE*  \n" +
            "╚════════════╝\n\n" +
            `👤 @${userToInsult.split('@')[0]}\n\n` +
            `💬 "${insult}"\n\n` +
            "> *DEV : 🍁AKANE KUROGAWAʕ◕ᴥ◕ʔ🌹*\n\n" +
            `*VOIR LA CHAINE* 🔥\n${CHANNEL_LINK}`;

        await client.sendMessage(remoteJid, { text: insultMessage, mentions: [userToInsult] });

    } catch (error) {
        console.error('Erreur insult:', error);
        await client.sendMessage(message.key?.remoteJid, { text: "❌ *Erreur*" });
    }
}

// ==================== COMMANDE SILENCE ====================
async function silenceCommand(client, message) {
    const jid = message.key.remoteJid;
    const sender = message.key.participant || jid;

    try {
        if (!jid.endsWith("@g.us")) {
            return client.sendMessage(jid, { text: "❌ *Groupes uniquement*" }, { quoted: message });
        }

        const metadata = await client.groupMetadata(jid);
        const admins = metadata.participants.filter(p => p.admin);
        const isAdmin = admins.some(p => p.id === sender);

        if (!isAdmin) {
            return client.sendMessage(jid, { text: "❌ *Tu dois etre admin*" }, { quoted: message });
        }

        await client.groupSettingUpdate(jid, "announcement");

        const successMessage = 
            "╔════════════╗\n" +
            "  *SILENCE*  \n" +
            "╚════════════╝\n\n" +
            "🔇 *Groupe ferme*\n\n" +
            "📝 *Seuls les admins peuvent parler*\n\n" +
            "> *DEV : 🍁AKANE KUROGAWAʕ◕ᴥ◕ʔ🌹*\n\n" +
            `*VOIR LA CHAINE* 🔥\n${CHANNEL_LINK}`;

        await client.sendMessage(jid, { text: successMessage }, { quoted: message });

    } catch (e) {
        console.log(e);
        client.sendMessage(jid, { text: "❌ *Le bot doit etre admin*" }, { quoted: message });
    }
}

// ==================== COMMANDE PARLER ====================
async function parlerCommand(client, message) {
    const jid = message.key.remoteJid;
    const sender = message.key.participant || jid;

    try {
        if (!jid.endsWith("@g.us")) {
            return client.sendMessage(jid, { text: "❌ *Groupes uniquement*" }, { quoted: message });
        }

        const metadata = await client.groupMetadata(jid);
        const admins = metadata.participants.filter(p => p.admin);
        const isAdmin = admins.some(p => p.id === sender);

        if (!isAdmin) {
            return client.sendMessage(jid, { text: "❌ *Tu dois etre admin*" }, { quoted: message });
        }

        await client.groupSettingUpdate(jid, "not_announcement");

        const participants = metadata.participants.map(p => p.id);

        const openMessage = 
            "╔════════════╗\n" +
            "  *PARLER*  \n" +
            "╚════════════╝\n\n" +
            "🔊 *Groupe ouvert*\n\n" +
            "🗣️ *Tout le monde peut parler !*\n\n" +
            "> *DEV : 🍁AKANE KUROGAWAʕ◕ᴥ◕ʔ🌹*\n\n" +
            `*VOIR LA CHAINE* 🔥\n${CHANNEL_LINK}`;

        await client.sendMessage(jid, { text: openMessage, mentions: participants }, { quoted: message });

    } catch (e) {
        console.log(e);
        client.sendMessage(jid, { text: "❌ *Le bot doit etre admin*" }, { quoted: message });
    }
}

// ==================== COMMANDE TRADUIT ====================
const languages = {
    "fr": { name: "Francais", flag: "🇫🇷" },
    "en": { name: "Anglais", flag: "🇬🇧" },
    "es": { name: "Espagnol", flag: "🇪🇸" },
    "de": { name: "Allemand", flag: "🇩🇪" },
    "it": { name: "Italien", flag: "🇮🇹" },
    "pt": { name: "Portugais", flag: "🇵🇹" },
    "nl": { name: "Neerlandais", flag: "🇳🇱" },
    "ru": { name: "Russe", flag: "🇷🇺" },
    "ja": { name: "Japonais", flag: "🇯🇵" },
    "ko": { name: "Coreen", flag: "🇰🇷" },
    "zh": { name: "Chinois", flag: "🇨🇳" },
    "ar": { name: "Arabe", flag: "🇸🇦" },
    "hi": { name: "Hindi", flag: "🇮🇳" },
    "tr": { name: "Turc", flag: "🇹🇷" },
    "pl": { name: "Polonais", flag: "🇵🇱" },
    "sv": { name: "Suedois", flag: "🇸🇪" },
    "da": { name: "Danois", flag: "🇩🇰" },
    "fi": { name: "Finnois", flag: "🇫🇮" },
    "el": { name: "Grec", flag: "🇬🇷" },
    "cs": { name: "Tcheque", flag: "🇨🇿" },
    "ro": { name: "Roumain", flag: "🇷🇴" },
    "hu": { name: "Hongrois", flag: "🇭🇺" },
    "th": { name: "Thai", flag: "🇹🇭" },
    "vi": { name: "Vietnamien", flag: "🇻🇳" },
    "id": { name: "Indonesien", flag: "🇮🇩" },
    "ms": { name: "Malais", flag: "🇲🇾" },
    "he": { name: "Hebreu", flag: "🇮🇱" },
    "uk": { name: "Ukrainien", flag: "🇺🇦" }
};

function detectLanguage(text) {
    const frenchChars = /[éèêëàâäîïôöûüçœæ]/i;
    const spanishChars = /[ñáéíóúü¿¡]/i;
    const germanChars = /[äöüß]/i;
    const japaneseChars = /[ぁ-んァ-ン一-龥]/;
    const chineseChars = /[一-龥]/;
    const russianChars = /[а-яА-Я]/;
    const arabicChars = /[أ-ي]/;
    const koreanChars = /[가-힣]/;
    const thaiChars = /[ก-๙]/;
    
    if (frenchChars.test(text)) return 'fr';
    if (spanishChars.test(text)) return 'es';
    if (germanChars.test(text)) return 'de';
    if (japaneseChars.test(text)) return 'ja';
    if (chineseChars.test(text)) return 'zh';
    if (russianChars.test(text)) return 'ru';
    if (arabicChars.test(text)) return 'ar';
    if (koreanChars.test(text)) return 'ko';
    if (thaiChars.test(text)) return 'th';
    return 'en';
}

async function traduitCommand(client, message) {
    try {
        const remoteJid = message.key?.remoteJid;
        const messageBody = message.message?.extendedTextMessage?.text || message.message?.conversation || '';
        const args = messageBody.slice(8).trim();

        if (!args) {
            const langList = Object.entries(languages).map(([code, { name, flag }]) => `${flag} *${code}*: ${name}`).join('\n');
            const helpMessage = 
                "╔══════════════════╗\n" +
                "     *TRADUCTEUR*    \n" +
                "╚══════════════════╝\n\n" +
                "📝 `.traduit [langue] [texte]`\n\n" +
                "📚 *Langues:*\n" + langList + '\n\n' +
                "📌 *Ex:* `.traduit en Bonjour`\n\n" +
                "> *DEV : 🍁AKANE KUROGAWAʕ◕ᴥ◕ʔ🌹*\n\n" +
                `*VOIR LA CHAINE* 🔥\n${CHANNEL_LINK}`;
            await client.sendMessage(remoteJid, { text: helpMessage });
            return;
        }

        const parts = args.split(' ');
        const targetLang = parts[0].toLowerCase();
        const textToTranslate = parts.slice(1).join(' ');

        if (!textToTranslate) {
            const errorMessage = 
                "╔══════════════════╗\n" +
                "       *ERREUR*      \n" +
                "╚══════════════════╝\n\n" +
                "❌ *Texte manquant !*\n\n" +
                "> *DEV : 🍁AKANE KUROGAWAʕ◕ᴥ◕ʔ🌹*\n\n" +
                `*VOIR LA CHAINE* 🔥\n${CHANNEL_LINK}`;
            await client.sendMessage(remoteJid, { text: errorMessage });
            return;
        }

        if (!languages[targetLang]) {
            const errorMessage = 
                "╔══════════════════╗\n" +
                "       *ERREUR*      \n" +
                "╚══════════════════╝\n\n" +
                `❌ Langue *${targetLang}* non supportee\n\n` +
                "> *DEV : 🍁AKANE KUROGAWAʕ◕ᴥ◕ʔ🌹*\n\n" +
                `*VOIR LA CHAINE* 🔥\n${CHANNEL_LINK}`;
            await client.sendMessage(remoteJid, { text: errorMessage });
            return;
        }

        const sourceLang = detectLanguage(textToTranslate);
        const sourceLangInfo = languages[sourceLang] || { name: sourceLang, flag: '🌐' };

        await client.sendMessage(remoteJid, { text: `🔄 ${sourceLangInfo.flag} → ${languages[targetLang].flag}` });

        try {
            const googleUrl = 'https://translate.googleapis.com/translate_a/single';
            const response = await axios.get(googleUrl, {
                params: {
                    client: 'gtx',
                    sl: sourceLang,
                    tl: targetLang,
                    dt: 't',
                    q: textToTranslate
                },
                timeout: 8000
            });

            if (response.data && response.data[0]) {
                const translatedText = response.data[0][0][0];
                const translationMessage = 
                    "╔══════════════════╗\n" +
                    "     *TRADUCTION*    \n" +
                    "╚══════════════════╝\n\n" +
                    `${sourceLangInfo.flag} *${textToTranslate}*\n\n` +
                    `${languages[targetLang].flag} *${translatedText}*\n\n` +
                    "> *DEV : 🍁AKANE KUROGAWAʕ◕ᴥ◕ʔ🌹*\n\n" +
                    `*VOIR LA CHAINE* 🔥\n${CHANNEL_LINK}`;
                await client.sendMessage(remoteJid, { text: translationMessage });
                return;
            }
        } catch (googleError) {
            console.log('Google Translate echoue, essai MyMemory...');
        }

        try {
            const response = await axios.get('https://api.mymemory.translated.net/get', {
                params: {
                    q: textToTranslate,
                    langpair: `${sourceLang}|${targetLang}`,
                    de: 'akane.md@gmail.com'
                },
                timeout: 8000
            });

            if (response.data && response.data.responseData) {
                const translatedText = response.data.responseData.translatedText;
                const translationMessage = 
                    "╔══════════════════╗\n" +
                    "     *TRADUCTION*    \n" +
                    "╚══════════════════╝\n\n" +
                    `${sourceLangInfo.flag} *${textToTranslate}*\n\n` +
                    `${languages[targetLang].flag} *${translatedText}*\n\n` +
                    "> *DEV : 🍁AKANE KUROGAWAʕ◕ᴥ◕ʔ🌹*\n\n" +
                    `*VOIR LA CHAINE* 🔥\n${CHANNEL_LINK}`;
                await client.sendMessage(remoteJid, { text: translationMessage });
                return;
            }
        } catch (memoryError) {
            console.log('MyMemory echoue');
        }

    } catch (error) {
        console.error('Erreur traduit:', error);
    }
}

// ==================== COMMANDE BIBLE ====================
const bibleBooks = {
    'genèse': 'Genesis', 'genese': 'Genesis',
    'exode': 'Exodus',
    'lévitique': 'Leviticus', 'levitique': 'Leviticus',
    'nombres': 'Numbers',
    'deutéronome': 'Deuteronomy', 'deuteronome': 'Deuteronomy',
    'josué': 'Joshua', 'josue': 'Joshua',
    'juges': 'Judges',
    'ruth': 'Ruth',
    '1 samuel': '1 Samuel', 'i samuel': '1 Samuel',
    '2 samuel': '2 Samuel', 'ii samuel': '2 Samuel',
    '1 rois': '1 Kings', 'i rois': '1 Kings',
    '2 rois': '2 Kings', 'ii rois': '2 Kings',
    '1 chroniques': '1 Chronicles', 'i chroniques': '1 Chronicles',
    '2 chroniques': '2 Chronicles', 'ii chroniques': '2 Chronicles',
    'esdras': 'Ezra',
    'néhémie': 'Nehemiah', 'nehemie': 'Nehemiah',
    'esther': 'Esther',
    'job': 'Job',
    'psaumes': 'Psalms', 'psaume': 'Psalms',
    'proverbes': 'Proverbs',
    'ecclésiaste': 'Ecclesiastes', 'ecclesiaste': 'Ecclesiastes',
    'cantique': 'Song of Solomon',
    'ésaïe': 'Isaiah', 'esaie': 'Isaiah',
    'jérémie': 'Jeremiah', 'jeremie': 'Jeremiah',
    'lamentations': 'Lamentations',
    'ézéchiel': 'Ezekiel', 'ezechiel': 'Ezekiel',
    'daniel': 'Daniel',
    'osée': 'Hosea', 'osee': 'Hosea',
    'joël': 'Joel', 'joel': 'Joel',
    'amos': 'Amos',
    'abdias': 'Obadiah',
    'jonas': 'Jonah',
    'michée': 'Micah', 'michee': 'Micah',
    'nahum': 'Nahum',
    'habacuc': 'Habakkuk',
    'sophonie': 'Zephaniah',
    'aggée': 'Haggai', 'aggee': 'Haggai',
    'zacharie': 'Zechariah',
    'malachie': 'Malachi',
    'matthieu': 'Matthew',
    'marc': 'Mark',
    'luc': 'Luke',
    'jean': 'John',
    'actes': 'Acts',
    'romains': 'Romans',
    '1 corinthiens': '1 Corinthians', 'i corinthiens': '1 Corinthians',
    '2 corinthiens': '2 Corinthians', 'ii corinthiens': '2 Corinthians',
    'galates': 'Galatians',
    'éphésiens': 'Ephesians', 'ephesiens': 'Ephesians',
    'philippiens': 'Philippians',
    'colossiens': 'Colossians',
    '1 thessaloniciens': '1 Thessalonians', 'i thessaloniciens': '1 Thessalonians',
    '2 thessaloniciens': '2 Thessalonians', 'ii thessaloniciens': '2 Thessalonians',
    '1 timothée': '1 Timothy', 'i timothée': '1 Timothy',
    '2 timothée': '2 Timothy', 'ii timothée': '2 Timothy',
    'tite': 'Titus',
    'philémon': 'Philemon', 'philemon': 'Philemon',
    'hébreux': 'Hebrews', 'hebreux': 'Hebrews',
    'jacques': 'James',
    '1 pierre': '1 Peter', 'i pierre': '1 Peter',
    '2 pierre': '2 Peter', 'ii pierre': '2 Peter',
    '1 jean': '1 John', 'i jean': '1 John',
    '2 jean': '2 John', 'ii jean': '2 John',
    '3 jean': '3 John', 'iii jean': '3 John',
    'jude': 'Jude',
    'apocalypse': 'Revelation'
};

function translateReference(ref) {
    ref = ref.toLowerCase().trim();
    for (const [fr, en] of Object.entries(bibleBooks)) {
        if (ref.startsWith(fr)) {
            return en + ref.substring(fr.length);
        }
    }
    return ref;
}

async function saveCommand(client, message) {
    try {
        const remoteJid = message.key?.remoteJid;
        const messageBody = message.message?.extendedTextMessage?.text || message.message?.conversation || '';
        const args = messageBody.slice(6).trim();

        if (!args) {
            const helpMessage = 
                "╔════════════╗\n" +
                "  *VERSET BIBLE*  \n" +
                "╚════════════╝\n\n" +
                "📝 `.save [reference]`\n\n" +
                "📌 *Ex:* `.save Jean 3:16`\n\n" +
                "> *DEV : 🍁AKANE KUROGAWAʕ◕ᴥ◕ʔ🌹*\n\n" +
                `*VOIR LA CHAINE* 🔥\n${CHANNEL_LINK}`;
            return await client.sendMessage(remoteJid, { text: helpMessage });
        }

        await client.sendMessage(remoteJid, { 
            text: `🔍 *Recherche de "${args}"...*`
        });

        const englishRef = translateReference(args);
        const apiUrl = `https://labs.bible.org/api/?passage=${encodeURIComponent(englishRef)}&type=json`;
        const response = await axios.get(apiUrl, { timeout: 10000 });

        if (!response.data || response.data.length === 0) {
            throw new Error('Verset non trouve');
        }

        const verseData = response.data[0];
        const bookname = verseData.bookname;
        const chapter = verseData.chapter;
        const verse = verseData.verse;
        const englishText = verseData.text.replace(/\(.*?\)/g, '').trim();

        const translateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fr&dt=t&q=${encodeURIComponent(englishText)}`;
        const translateResponse = await axios.get(translateUrl, { timeout: 10000 });

        let frenchText = '';
        if (translateResponse.data && translateResponse.data[0]) {
            frenchText = translateResponse.data[0].map(item => item[0]).join(' ');
        }

        if (!frenchText) throw new Error('Traduction echouee');

        const bibleMessage = 
            "╔════════════╗\n" +
            "  *VERSET BIBLE*  \n" +
            "╚════════════╝\n\n" +
            `📖 *${bookname} ${chapter}:${verse}*\n\n` +
            `"${frenchText}"\n\n` +
            "📌 _Traduction auto_\n\n" +
            "> *DEV : 🍁AKANE KUROGAWAʕ◕ᴥ◕ʔ🌹*\n\n" +
            `*VOIR LA CHAINE* 🔥\n${CHANNEL_LINK}`;

        await client.sendMessage(remoteJid, { text: bibleMessage });

    } catch (error) {
        console.error('Erreur save:', error);
        const errorMessage = 
            "╔════════════╗\n" +
            "  *ERREUR*  \n" +
            "╚════════════╝\n\n" +
            "❌ *Verset non trouve*\n\n" +
            "> *DEV : 🍁AKANE KUROGAWAʕ◕ᴥ◕ʔ🌹*\n\n" +
            `*VOIR LA CHAINE* 🔥\n${CHANNEL_LINK}`;
        await client.sendMessage(message.key?.remoteJid, { text: errorMessage });
    }
}

// ==================== FONCTION PRINCIPALE ====================
export default async function allCommands(sock, message) {
    const messageBody = message.message?.extendedTextMessage?.text || message.message?.conversation || '';
    const command = messageBody.slice(1).split(' ')[0].toLowerCase();

    switch(command) {
        case 'api':
            await apiCommand(sock, message);
            break;
        case 'apis':
            await apisCommand(sock, message);
            break;
        case 'gpt':
            await gptCommand(sock, message);
            break;
        case 'restart':
            await restartCommand(sock, message);
            break;
        case 'tiktok':
            await tiktokCommand(sock, message);
            break;
        case 'insulte':
            await insultCommand(sock, message);
            break;
        case 'silence':
            await silenceCommand(sock, message);
            break;
        case 'parler':
            await parlerCommand(sock, message);
            break;
        case 'traduit':
            await traduitCommand(sock, message);
            break;
        case 'save':
        case 'bible':
            await saveCommand(sock, message);
            break;
        default:
            // Commande inconnue - ne rien faire
            break;
    }
}