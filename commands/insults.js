import stylizedChar from '../utils/fancy.js';

// 🔗 LIEN DE TA CHAÎNE WHATSAPP
const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbBzhyQ4NVisPH1NSe1R';

const insults = [
    "T'es comme un nuage. Quand tu disparais, c'est une belle journée !",
    "Tu apportes tellement de joie aux gens... quand tu quittes la pièce !",
    "Je serais d'accord avec toi, mais après on aurait tous les deux tort.",
    "T'es pas bête, t'as juste de la malchance quand tu réfléchis.",
    "Tes secrets sont toujours en sécurité avec moi. Je ne les écoute même jamais.",
    "T'es la preuve que même l'évolution prend des pauses parfois.",
    "T'as un truc sur le menton... non, le troisième en bas.",
    "T'es comme une mise à jour logicielle. Dès que je te vois, je me dis 'J'ai vraiment besoin de ça maintenant ?'",
    "Tu rends tout le monde heureux... tu sais, quand tu t'en vas.",
    "T'es comme une pièce de monnaie—deux faces et pas beaucoup de valeur.",
    "T'as quelque chose en tête... oh attends, never mind.",
    "T'es la raison pour laquelle ils mettent des modes d'emploi sur les bouteilles de shampooing.",
    "T'es comme un nuage. Toujours à flotter sans vrai but.",
    "Tes blagues sont comme du lait périmé—aigres et difficiles à digérer.",
    "T'es comme une bougie dans le vent... inutile quand les choses deviennent difficiles.",
    "T'as quelque chose d'unique—ta capacité à énerver tout le monde également.",
    "T'es comme un signal Wi-Fi—toujours faible quand on a le plus besoin.",
    "T'es la preuve que tout le monde n'a pas besoin d'un filtre pour être désagréable.",
    "Ton énergie est comme un trou noir—elle aspire juste la vie de la pièce.",
    "T'as le visage parfait pour la radio.",
    "T'es comme un embouteillage—personne ne te veut, mais te voilà.",
    "T'es comme un crayon cassé—sans intérêt.",
    "Tes idées sont tellement originales, je suis sûr de les avoir déjà toutes entendues.",
    "T'es la preuve vivante que même les erreurs peuvent être productives.",
    "T'es pas paresseux, t'es juste très motivé à ne rien faire.",
    "Ton cerveau tourne sous Windows 95—lent et dépassé.",
    "T'es comme un ralentisseur—personne ne t'aime, mais tout le monde doit te supporter.",
    "T'es comme un nuage de moustiques—juste irritant.",
    "Tu rassembles les gens... pour parler de à quel point t'es énervant."
];

async function insultCommand(client, message) {
    try {
        const remoteJid = message.key?.remoteJid;

        if (!message || !remoteJid) {
            console.log('Message ou destinataire invalide:', { message, remoteJid });
            return;
        }

        let userToInsult;

        // Vérifier les utilisateurs mentionnés
        if (message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
            userToInsult = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
        }
        // Vérifier le message auquel on répond
        else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
            userToInsult = message.message.extendedTextMessage.contextInfo.participant;
        }

        if (!userToInsult) {
            await client.sendMessage(remoteJid, { 
                text: stylizedChar("👀 *Mentionne quelqu'un ou réponds à son message pour l'insulter !*")
            });
            return;
        }

        const insult = insults[Math.floor(Math.random() * insults.length)];

        // Construire le message avec la présentation de la chaîne
        const insultMessage = 
            "╔══════════════════╗\n" +
            "    *INSULTE DU JOUR*  \n" +
            "╚══════════════════╝\n\n" +
            "━━━━━━━━━━━━━━━━━━━\n\n" +
            `👤 *Cible:* @${userToInsult.split('@')[0]}\n\n` +
            `💬 *Insulte:*\n"${insult}"\n\n` +
            "━━━━━━━━━━━━━━━━━━━\n\n" +
            "> *𝐃𝐄𝐕 : 𝐀𝐊𝐀𝐍𝐄 𝐊𝐔𝐑𝐎𝐆𝐀𝐖𝐀*\n\n" +
            "*Voir la chaîne* 🔥\n" +
            `${CHANNEL_LINK}\n\n` +
            "> *_© 𝐀𝐊𝐀𝐍𝐄-𝐌𝐃 🌹_*";

        await client.sendMessage(remoteJid, { 
            text: insultMessage,
            mentions: [userToInsult]
        });

    } catch (error) {
        console.error('Erreur dans la commande insult:', error);

        const remoteJid = message.key?.remoteJid;
        if (!remoteJid) return;

        const errorMessage = 
            "╔══════════════════╗\n" +
            "    *ERREUR*  \n" +
            "╚══════════════════╝\n\n" +
            "━━━━━━━━━━━━━━━━━━━\n\n" +
            "❌ *Une erreur est survenue*\n\n" +
            "━━━━━━━━━━━━━━━━━━━\n\n" +
            "> *𝐃𝐄𝐕 : 𝐀𝐊𝐀𝐍𝐄 𝐊𝐔𝐑𝐎𝐆𝐀𝐖𝐀*\n\n" +
            "*Voir la chaîne* 🔥\n" +
            `${CHANNEL_LINK}\n\n` +
            "> *_© 𝐀𝐊𝐀𝐍𝐄-𝐌𝐃 🌹_*";

        await client.sendMessage(remoteJid, { 
            text: stylizedChar(errorMessage)
        });
    }
}

export default insultCommand;