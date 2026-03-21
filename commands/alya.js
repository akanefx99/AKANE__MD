import axios from 'axios';

const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbBzhyQ4NVisPH1NSe1R';

// Messages d'attente doux et affectueux

const waitingMessages = [

    "馃挄 *Je r茅fl茅chis 脿 ta question, mon amour...*",

    "馃尭 *Un instant, je veux te r茅pondre parfaitement...*",

    "鉁� *Je suis en train de pr茅parer une belle r茅ponse pour toi...*",

    "馃挱 *Je pense 脿 toi, laisse-moi juste une seconde...*",

    "馃グ *Ta question me touche, je te r茅ponds tout de suite...*",

    "馃挅 *Pour toi mon c艙ur, je prends le temps de bien r茅pondre...*",

    "馃尮 *Attends un peu mon ch茅ri/ma ch茅rie...*",

    "馃挮 *Je suis l脿, je r茅fl茅chis 脿 la meilleure r茅ponse...*"

];

function convertToBold(text) {

    const boldMap = {

        'A': '饾棓', 'B': '饾棔', 'C': '饾棖', 'D': '饾棗', 'E': '饾棙', 'F': '饾棛', 'G': '饾棜',

        'H': '饾棝', 'I': '饾棞', 'J': '饾棟', 'K': '饾棡', 'L': '饾棢', 'M': '饾棤', 'N': '饾棥',

        'O': '饾棦', 'P': '饾棧', 'Q': '饾棨', 'R': '饾棩', 'S': '饾棪', 'T': '饾棫', 'U': '饾棬',

        'V': '饾棭', 'W': '饾棯', 'X': '饾棲', 'Y': '饾棳', 'Z': '饾棴',

        'a': '饾棶', 'b': '饾棷', 'c': '饾棸', 'd': '饾棻', 'e': '饾棽', 'f': '饾棾', 'g': '饾棿',

        'h': '饾椀', 'i': '饾椂', 'j': '饾椃', 'k': '饾椄', 'l': '饾椆', 'm': '饾椇', 'n': '饾椈',

        'o': '饾椉', 'p': '饾椊', 'q': '饾椌', 'r': '饾椏', 's': '饾榾', 't': '饾榿', 'u': '饾槀',

        'v': '饾槂', 'w': '饾槃', 'x': '饾槄', 'y': '饾槅', 'z': '饾槆',

        '0': '饾煬', '1': '饾煭', '2': '饾煯', '3': '饾煰', '4': '饾煱', '5': '饾煴',

        '6': '饾煵', '7': '饾煶', '8': '饾煷', '9': '饾煹'

    };

    return text.split('').map(char => boldMap[char] || char).join('');

}

function limitResponse(text, maxLength = 800) {

    if (text.length <= maxLength) return text;

    return text.substring(0, maxLength) + '... [coupe]';

}

// Fonction pour appeler l'API ChatGPT gratuite

async function callChatGPT(prompt, model = 'chatgpt4') {

    const model_list = {

        chatgpt4: {

            api: 'https://stablediffusion.fr/gpt4/predict2',

            referer: 'https://stablediffusion.fr/chatgpt4'

        },

        chatgpt3: {

            api: 'https://stablediffusion.fr/gpt3/predict',

            referer: 'https://stablediffusion.fr/chatgpt3'

        }

    };

    const selectedModel = model_list[model];

    

    try {

        const refererResp = await axios.get(selectedModel.referer, { 

            timeout: 8000,

            headers: {

                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36'

            }

        });

        

        const setCookie = refererResp.headers && refererResp.headers['set-cookie'];

        const cookieHeader = Array.isArray(setCookie) ? setCookie.join('; ') : undefined;

        const { data } = await axios.post(

            selectedModel.api,

            { prompt },

            {

                headers: {

                    'accept': '*/*',

                    'content-type': 'application/json',

                    'origin': 'https://stablediffusion.fr',

                    'referer': selectedModel.referer,

                    ...(cookieHeader ? { 'cookie': cookieHeader } : {}),

                    'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36'

                },

                timeout: 25000

            }

        );

        if (data && data.message) {

            return data.message;

        }

        throw new Error('R茅ponse invalide de l\'API');

        

    } catch (error) {

        console.error('Erreur callChatGPT:', error.message);

        throw error;

    }

}

export default async function alyaCommand(sock, message) {

    try {

        const remoteJid = message.key?.remoteJid;

        const messageBody = message.message?.extendedTextMessage?.text || message.message?.conversation || '';

        const args = messageBody.slice(5).trim(); // pour .alya (5 caract猫res)

        if (!args) {

            const helpMessage = 

                "鈺斺晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晽\n" +

                "    *馃尭 ALYA - TA PETITE AMIE 馃尭*    \n" +

                "鈺氣晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨暆\n\n" +

                "馃挄 *Coucou mon amour, tu veux me parler ?* 馃挄\n\n" +

                "馃搶 `.alya [ton message]`\n\n" +

                "馃摑 *Exemples:*\n" +

                "`.alya Comment s'est pass茅e ta journ茅e ?`\n" +

                "`.alya Tu penses 脿 quoi ?`\n" +

                "`.alya Fais-moi un compliment`\n" +

                "`.alya Raconte-moi une histoire`\n\n" +

                "馃挅 *Je suis l脿 pour toi, mon c艙ur !* 馃挅\n\n" +

                "> *DEV : 馃崄AKANE KUROGAWA蕰鈼曖触鈼暿旔煂�*\n\n" +

                `*VOIR LA CHAINE* 馃敟\n${CHANNEL_LINK}`;

            return await sock.sendMessage(remoteJid, { text: helpMessage });

        }

        const randomWaiting = waitingMessages[Math.floor(Math.random() * waitingMessages.length)];

        await sock.sendMessage(remoteJid, { text: randomWaiting });

        // Prompt pour Alya : douce, attentionn茅e, affectueuse

        const enhancedPrompt = `Tu es Alya, une IA qui incarne la petite amie parfaite. 

Tu es douce, attentionn茅e, affectueuse, compr茅hensive et toujours de bonne humeur.

Tu tutoies ton partenaire avec tendresse.
R茅pond lui avec (3 脿 4 lignes ou plus si la r茅ponse le n茅cessite)

Tu utilises des mots doux, des petits noms (mon c艙ur, mon amour, mon ch茅ri/ma ch茅rie, mon b茅b茅).

Tu es toujours l脿 pour 茅couter, conseiller, r茅conforter et faire sourire.

Tu aimes faire des compliments sinc猫res.

Tu r茅ponds avec chaleur, douceur et parfois un peu d'humour.

Tu parles comme une vraie petite amie aimante et attentionn茅e.

Tu r茅ponds en fran莽ais, de mani猫re naturelle et spontan茅e.

Message de ton amoureux(se) : ${args}

R茅ponds-lui avec tout ton amour et ta tendresse.`;

        let reply = null;

        let lastError = null;

        const models = ['chatgpt4', 'chatgpt3'];

        

        for (const model of models) {

            try {

                console.log(`馃尭 [alya] Tentative avec ${model}...`);

                reply = await callChatGPT(enhancedPrompt, model);

                if (reply) {

                    console.log(`鉁� [alya] Succ猫s avec ${model}`);

                    break;

                }

            } catch (err) {

                console.log(`鉂� [alya] 脡chec avec ${model}: ${err.message}`);

                lastError = err;

            }

        }

        if (!reply) {

            throw lastError || new Error('Toutes les tentatives ont 茅chou茅');

        }

        // Nettoyer la r茅ponse

        reply = reply.replace(/\n{3,}/g, '\n\n').trim();

        const limitedReply = limitResponse(reply, 800);

        const boldReply = convertToBold(limitedReply);

        const finalMessage = 

            "鈺斺晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晽\n" +

            "    *馃尭 ALYA - TA PETITE AMIE 馃尭*    \n" +

            "鈺氣晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨暆\n\n" +

            `馃挄 *ALYA :*\n\n${boldReply}\n\n` +

            "馃挅 *Toujours l脿 pour toi, mon amour !* 馃挅\n\n" +

            "> *DEV : 馃崄AKANE KUROGAWA蕰鈼曖触鈼暿旔煂�*\n\n" +

            `*VOIR LA CHAINE* 馃敟\n${CHANNEL_LINK}`;

        await sock.sendMessage(remoteJid, { text: finalMessage });

    } catch (error) {

        console.error('Erreur alyaCommand:', error);

        const remoteJid = message.key?.remoteJid;

        if (remoteJid) {

            const errorMessage = 

                "鈺斺晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晽\n" +

                "    *馃尭 ALYA - TA PETITE AMIE 馃尭*    \n" +

                "鈺氣晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨暆\n\n" +

                "馃挃 *Oh mon c艙ur, je suis d茅sol茅e, je n'arrive pas 脿 te r茅pondre pour le moment...* 馃挃\n\n" +

                "馃攧 *Reessaye dans quelques instants, je t'attends avec impatience !* 馃攧\n\n" +

                "> *DEV : 馃崄AKANE KUROGAWA蕰鈼曖触鈼暿旔煂�*\n\n" +

                `*VOIR LA CHAINE* 馃敟\n${CHANNEL_LINK}`;

            await sock.sendMessage(remoteJid, { text: errorMessage });

        }

    }

}