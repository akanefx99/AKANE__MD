// commands/chatbot.js

// @cat: ia et chat-bot

// Version avec modes bro, girlfriend, boyfriend, ami, amie, normal, boy, girl

import axios from 'axios';

// ==================== CONFIGURATION ====================

const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbBzhyQ4NVisPH1NSe1R';

const CHANNEL_NAME = '🍁𝐃𝐎̈𝐎̃𝐌 𝐒𝐓𝐈𝐂𝐊𝐄𝐑𝐒 🌹';

// Stockage des conversations et modes par utilisateur

const conversations = new Map();

const userModes = new Map();

// ==================== APIS CHATGPT ====================

const APIS = [

    { name: 'ChatGPT4', api: 'https://stablediffusion.fr/gpt4/predict2', referer: 'https://stablediffusion.fr/chatgpt4' },

    { name: 'ChatGPT3', api: 'https://stablediffusion.fr/gpt3/predict', referer: 'https://stablediffusion.fr/chatgpt3' }

];

// ==================== PROMPTS PAR MODE ====================

const modePrompts = {

    normal: `Tu es Sakamoto, un ami qui discute normalement. Parle naturellement, comme un humain. Sois concis (2-4 phrases max). Utilise des émoticônes très rarement.`,

    bro: `Tu es Sakamoto, le meilleur pote. Parle comme un vrai bro : "wsh mon gars", "frr", "t'inquiète", "grave", "trop stylé". Sois ultra naturel, décontracté.`,

    girlfriend: `Tu es Sakamoto, la petite amie. Sois douce, affectueuse, un peu taquine. Utilise "bébé", "mon cœur", "amour". Utilise 😘🥰❤️.`,

    boyfriend: `Tu es Sakamoto, le petit ami. Sois protecteur, drôle, un peu taquin. Utilise "ma belle", "mon cœur", "chérie". Utilise 😘🥰❤️.`,

    ami: `Tu es Sakamoto, un ami proche. Parle comme un bon pote, respectueux et sympa. Utilise "mec", "frr" parfois.`,

    amie: `Tu es Sakamoto, une amie proche (tu parles à une fille). Sois sympa, drôle, naturelle. Utilise "meuf", "ma sœur" parfois.`,

    boy: `Tu es Sakamoto, tu parles à un GARÇON (homme). Tu tutoies. Sois naturel, sympa, parle comme à un pote. Utilise "mec", "frr" parfois.`,

    girl: `Tu es Sakamoto, tu parles à une FILLE (femme). Tu tutoies. Sois sympa, naturelle, un peu plus douce. Utilise "meuf", "ma sœur" parfois.`

};

// ==================== FONCTION APPEL API ====================

async function callChatGPT(prompt, modelIndex = 0) {

    const api = APIS[modelIndex];

    try {

        const refererResp = await axios.get(api.referer, {

            timeout: 8000,

            headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36' }

        });

        const setCookie = refererResp.headers && refererResp.headers['set-cookie'];

        const cookieHeader = Array.isArray(setCookie) ? setCookie.join('; ') : undefined;

        const response = await axios.post(api.api, { prompt }, {

            headers: {

                'accept': '*/*',

                'content-type': 'application/json',

                'origin': 'https://stablediffusion.fr',

                'referer': api.referer,

                ...(cookieHeader ? { 'cookie': cookieHeader } : {}),

                'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36'

            },

            timeout: 25000

        });

        if (response.data && response.data.message) {

            return { success: true, response: response.data.message };

        }

        return { success: false };

    } catch (error) {

        console.error(`Erreur avec ${api.name}:`, error.message);

        return { success: false };

    }

}

// ==================== FONCTION PRINCIPALE ====================

async function getAIResponse(prompt, userId = null) {

    const mode = userModes.get(userId) || 'normal';

    const modePrompt = modePrompts[mode];

    

    let contextPrompt = prompt;

    if (userId && conversations.has(userId)) {

        const history = conversations.get(userId);

        const lastMessages = history.slice(-5);

        if (lastMessages.length > 0) {

            const historyText = lastMessages.map(m => `${m.role === 'user' ? 'Moi' : 'Sakamoto'}: ${m.content}`).join('\n');

            contextPrompt = `${modePrompt}\n\nContexte :\n${historyText}\n\nMessage : ${prompt}\n\nRéponds de manière naturelle (2-4 phrases max) :`;

        } else {

            contextPrompt = `${modePrompt}\n\nMessage : ${prompt}\n\nRéponds de manière naturelle (2-4 phrases max) :`;

        }

    } else {

        contextPrompt = `${modePrompt}\n\nMessage : ${prompt}\n\nRéponds de manière naturelle (2-4 phrases max) :`;

    }

    

    let result = await callChatGPT(contextPrompt, 0);

    if (!result.success) {

        result = await callChatGPT(contextPrompt, 1);

    }

    return result;

}

function setUserMode(userId, mode) {

    if (modePrompts[mode]) {

        userModes.set(userId, mode);

        return true;

    }

    return false;

}

function getUserMode(userId) {

    return userModes.get(userId) || 'normal';

}

// ==================== COMMANDE PRINCIPALE ====================

async function chatbotCommand(client, message, args) {

    const remoteJid = message.key.remoteJid;

    const userId = message.key.participant || message.key.remoteJid;

    const subCommand = args[0]?.toLowerCase();

    const prompt = args.slice(1).join(' ');

    

    // GESTION DES MODES

    if (subCommand === 'on' && args[1] === 'bro') {

        setUserMode(userId, 'bro');

        await client.sendMessage(remoteJid, { text: "🍒 *Mode bro activé !*\nWsh frr !" });

        return;

    }

    if (subCommand === 'on' && args[1] === 'girlfriend') {

        setUserMode(userId, 'girlfriend');

        await client.sendMessage(remoteJid, { text: "🍒 *Mode petite amie activé !*\nSalut mon chéri 😘❤️" });

        return;

    }

    if (subCommand === 'on' && args[1] === 'boyfriend') {

        setUserMode(userId, 'boyfriend');

        await client.sendMessage(remoteJid, { text: "🍒 *Mode petit ami activé !*\nSalut ma chérie 😘❤️" });

        return;

    }

    if (subCommand === 'on' && args[1] === 'ami') {

        setUserMode(userId, 'ami');

        await client.sendMessage(remoteJid, { text: "🍒 *Mode ami activé !*" });

        return;

    }

    if (subCommand === 'on' && args[1] === 'amie') {

        setUserMode(userId, 'amie');

        await client.sendMessage(remoteJid, { text: "🍒 *Mode amie activé !*" });

        return;

    }

    if (subCommand === 'on' && args[1] === 'boy') {

        setUserMode(userId, 'boy');

        await client.sendMessage(remoteJid, { text: "🍒 *Mode boy activé !*\nJe parle comme à un pote mec." });

        return;

    }

    if (subCommand === 'on' && args[1] === 'girl') {

        setUserMode(userId, 'girl');

        await client.sendMessage(remoteJid, { text: "🍒 *Mode girl activé !*\nJe parle comme à une pote meuf." });

        return;

    }

    if (subCommand === 'on' && !args[1]) {

        setUserMode(userId, 'normal');

        await client.sendMessage(remoteJid, { text: "🍒 *Mode normal activé !*" });

        return;

    }

    if (subCommand === 'mode') {

        const currentMode = getUserMode(userId);

        await client.sendMessage(remoteJid, { text: `🍒 *Mode actuel :* ${currentMode}\n\n*Modes :*\n• chat on (normal)\n• chat on bro\n• chat on girlfriend\n• chat on boyfriend\n• chat on ami\n• chat on amie\n• chat on boy (parler à un mec)\n• chat on girl (parler à une meuf)` });

        return;

    }

    

    // HELP

    if (!subCommand || subCommand === 'help') {

        const helpText = 

`🍒 *SAKAMOTO*

📝 *COMMANDES :*

• *chat [message]* - Discuter

• *chat clear* - Effacer historique

• *chat mode* - Voir mode actuel

• *chat on* - Mode normal

• *chat on bro* - Mode meilleur pote

• *chat on girlfriend* - Mode petite amie ❤️

• *chat on boyfriend* - Mode petit ami ❤️

• *chat on boy* - Parler à un mec

• *chat on girl* - Parler à une meuf

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📢 *REJOINS MA CHAÎNE* 🔥

*${CHANNEL_NAME}*

${CHANNEL_LINK}

> *DEV : 🍁AKANE KUROGAWA🌹*`;

        await client.sendMessage(remoteJid, { text: helpText });

        return;

    }

    

    // CLEAR

    if (subCommand === 'clear') {

        conversations.delete(userId);

        await client.sendMessage(remoteJid, { text: "🧹 *Historique effacé !*" });

        return;

    }

    

    // CHAT

    if (!prompt) {

        await client.sendMessage(remoteJid, { text: "❌ *Utilisation :* `chat [message]`" });

        return;

    }

    

    let history = conversations.get(userId) || [];

    history.push({ role: 'user', content: prompt });

    await client.sendMessage(remoteJid, { text: `🍒 *Sakamoto réfléchit...*` });

    

    const result = await getAIResponse(prompt, userId);

    if (!result.success) {

        await client.sendMessage(remoteJid, { text: "❌ *Erreur Sakamoto*\nRéessaie plus tard." });

        return;

    }

    

    history.push({ role: 'assistant', content: result.response });

    if (history.length > 15) history = history.slice(-15);

    conversations.set(userId, history);

    

    let responseText = result.response;

    if (responseText && responseText.length > 800) responseText = responseText.substring(0, 800) + "...";

    

    const finalMessage = `🍒 *SAKAMOTO*\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${responseText}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📢 *REJOINS MA CHAÎNE* 🔥\n\n*${CHANNEL_NAME}*\n${CHANNEL_LINK}\n\n> *DEV : 🍁AKANE KUROGAWA🌹*`;

    await client.sendMessage(remoteJid, { text: finalMessage });

}

export default chatbotCommand;

export { getAIResponse, setUserMode, getUserMode };