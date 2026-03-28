// commands/chatbot.js

// @cat: ia et chat-bot

// Version corrigée - Désactivation par défaut et plus humain

import axios from 'axios';

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

// ==================== PROMPTS PLUS HUMAINS ====================

const modePrompts = {

    normal: `Tu es Sakamoto, un pote cool. Parle naturellement, comme un humain. Réponds de manière simple et naturelle. Sois concis.`,

    bro: `Tu es Sakamoto, un pote. Parle comme un mec normal. Utilise "frr" parfois. Sois naturel, pas trop familier.`,

    girlfriend: `Tu es Sakamoto. Parle normalement, comme une pote. Sois sympa sans être collante.`,

    boyfriend: `Tu es Sakamoto. Parle normalement, comme un pote. Sois sympa sans être collant.`,

    ami: `Tu es Sakamoto, un pote. Parle normalement. Sois sympa.`,

    amie: `Tu es Sakamoto, une pote. Parle normalement. Sois sympa.`,

    boy: `Tu es Sakamoto, tu parles à un pote. Sois naturel.`,

    girl: `Tu es Sakamoto, tu parles à une fille. Sois naturel.`

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

            contextPrompt = `${modePrompt}\n\nContexte:\n${historyText}\n\nMessage: ${prompt}\n\nRéponds simplement:`;

        } else {

            contextPrompt = `${modePrompt}\n\nMessage: ${prompt}\n\nRéponds simplement:`;

        }

    } else {

        contextPrompt = `${modePrompt}\n\nMessage: ${prompt}\n\nRéponds simplement:`;

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

        await client.sendMessage(remoteJid, { text: "🍒 Mode bro activé" });

        return;

    }

    if (subCommand === 'on' && args[1] === 'girlfriend') {

        setUserMode(userId, 'girlfriend');

        await client.sendMessage(remoteJid, { text: "🍒 Mode girlfriend activé" });

        return;

    }

    if (subCommand === 'on' && args[1] === 'boyfriend') {

        setUserMode(userId, 'boyfriend');

        await client.sendMessage(remoteJid, { text: "🍒 Mode boyfriend activé" });

        return;

    }

    if (subCommand === 'on' && args[1] === 'ami') {

        setUserMode(userId, 'ami');

        await client.sendMessage(remoteJid, { text: "🍒 Mode ami activé" });

        return;

    }

    if (subCommand === 'on' && args[1] === 'amie') {

        setUserMode(userId, 'amie');

        await client.sendMessage(remoteJid, { text: "🍒 Mode amie activé" });

        return;

    }

    if (subCommand === 'on' && args[1] === 'boy') {

        setUserMode(userId, 'boy');

        await client.sendMessage(remoteJid, { text: "🍒 Mode boy activé" });

        return;

    }

    if (subCommand === 'on' && args[1] === 'girl') {

        setUserMode(userId, 'girl');

        await client.sendMessage(remoteJid, { text: "🍒 Mode girl activé" });

        return;

    }

    if (subCommand === 'on' && !args[1]) {

        setUserMode(userId, 'normal');

        await client.sendMessage(remoteJid, { text: "🍒 Mode normal activé" });

        return;

    }

    if (subCommand === 'mode') {

        const currentMode = getUserMode(userId);

        await client.sendMessage(remoteJid, { text: `🍒 Mode actuel : ${currentMode}` });

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

• *chat on bro* - Mode pote

• *chat on girlfriend* - Mode copine

• *chat on boyfriend* - Mode copain

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📢 *REJOINS MA CHAÎNE* 🔥

*${CHANNEL_NAME}*

${CHANNEL_LINK}

> *DEV : AKANE KUROGAWA🌹*`;

        

        await client.sendMessage(remoteJid, { text: helpText });

        return;

    }

    

    // CLEAR

    if (subCommand === 'clear') {

        conversations.delete(userId);

        await client.sendMessage(remoteJid, { text: "🧹 Historique effacé" });

        return;

    }

    

    // CHAT

    if (!prompt) {

        await client.sendMessage(remoteJid, { text: "❌ Utilisation : chat [message]" });

        return;

    }

    

    let history = conversations.get(userId) || [];

    history.push({ role: 'user', content: prompt });

    

    const result = await getAIResponse(prompt, userId);

    if (!result.success) {

        await client.sendMessage(remoteJid, { text: "❌ Erreur, réessaie plus tard" });

        return;

    }

    

    history.push({ role: 'assistant', content: result.response });

    if (history.length > 15) history = history.slice(-15);

    conversations.set(userId, history);

    

    let responseText = result.response;

    if (responseText && responseText.length > 500) responseText = responseText.substring(0, 500) + "...";

    

    await client.sendMessage(remoteJid, { text: responseText });

}

export default chatbotCommand;

export { getAIResponse, setUserMode, getUserMode };