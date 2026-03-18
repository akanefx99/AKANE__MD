import axios from 'axios';

// 🔗 LIEN DE TA CHAÎNE WHATSAPP

const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbBzhyQ4NVisPH1NSe1R';

// Liste des langues avec drapeaux

const languages = {

    "fr": { name: "Français", flag: "🇫🇷" },

    "en": { name: "Anglais", flag: "🇬🇧" },

    "es": { name: "Espagnol", flag: "🇪🇸" },

    "de": { name: "Allemand", flag: "🇩🇪" },

    "it": { name: "Italien", flag: "🇮🇹" },

    "pt": { name: "Portugais", flag: "🇵🇹" },

    "nl": { name: "Néerlandais", flag: "🇳🇱" },

    "ru": { name: "Russe", flag: "🇷🇺" },

    "ja": { name: "Japonais", flag: "🇯🇵" },

    "ko": { name: "Coréen", flag: "🇰🇷" },

    "zh": { name: "Chinois", flag: "🇨🇳" },

    "ar": { name: "Arabe", flag: "🇸🇦" },

    "hi": { name: "Hindi", flag: "🇮🇳" },

    "tr": { name: "Turc", flag: "🇹🇷" },

    "pl": { name: "Polonais", flag: "🇵🇱" },

    "sv": { name: "Suédois", flag: "🇸🇪" },

    "da": { name: "Danois", flag: "🇩🇰" },

    "fi": { name: "Finnois", flag: "🇫🇮" },

    "el": { name: "Grec", flag: "🇬🇷" },

    "cs": { name: "Tchèque", flag: "🇨🇿" },

    "ro": { name: "Roumain", flag: "🇷🇴" },

    "hu": { name: "Hongrois", flag: "🇭🇺" },

    "th": { name: "Thaï", flag: "🇹🇭" },

    "vi": { name: "Vietnamien", flag: "🇻🇳" },

    "id": { name: "Indonésien", flag: "🇮🇩" },

    "ms": { name: "Malais", flag: "🇲🇾" },

    "he": { name: "Hébreu", flag: "🇮🇱" },

    "uk": { name: "Ukrainien", flag: "🇺🇦" }

};

// Fonction pour détecter automatiquement la langue

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

        const args = messageBody.slice(8).trim(); // ".traduit " = 8 caractères

        

        if (!args) {

            const langList = Object.entries(languages)

                .map(([code, { name, flag }]) => `${flag} *${code}*: ${name}`)

                .join('\n');

            

            // Message SANS stylizedChar pour que le lien soit bleu

            const helpMessage = 

                "╔══════════════════╗\n" +

                "    *TRADUCTEUR*  \n" +

                "╚══════════════════╝\n\n" +

                "━━━━━━━━━━━━━━━━━━━\n\n" +

                "📝 *Comment utiliser:*\n" +

                "`.traduit [langue] [texte]`\n\n" +

                "📚 *Langues disponibles:*\n" +

                `${langList}\n\n` +

                "━━━━━━━━━━━━━━━━━━━\n\n" +

                "📌 *Exemples:*\n" +

                "`.traduit en Bonjour` 🇫🇷 → 🇬🇧\n" +

                "`.traduit es Hello` 🇬🇧 → 🇪🇸\n" +

                "`.traduit de I love you` 🇬🇧 → 🇩🇪\n\n" +

                "━━━━━━━━━━━━━━━━━━━\n\n" +

                "> *𝐃𝐄𝐕 : 𝐀𝐊𝐀𝐍𝐄 𝐊𝐔𝐑𝐎𝐆𝐀𝐖𝐀*\n\n" +

                "*Voir la chaîne* 🔥\n" +

                `${CHANNEL_LINK}\n\n` +

                "━━━━━━━━━━━━━━━━━━━\n" +

                "> *_© 𝐀𝐊𝐀𝐍𝐄-𝐌𝐃 🌹_*";

            await client.sendMessage(remoteJid, { 

                text: helpMessage  // PLUS DE stylizedChar !

            });

            return;

        }

        const parts = args.split(' ');

        const targetLang = parts[0].toLowerCase();

        const textToTranslate = parts.slice(1).join(' ');

        if (!textToTranslate) {

            const errorMessage = 

                "╔══════════════════╗\n" +

                "    *ERREUR*  \n" +

                "╚══════════════════╝\n\n" +

                "━━━━━━━━━━━━━━━━━━━\n\n" +

                "❌ *Texte manquant !*\n\n" +

                "📝 *Exemple:* `.traduit en Bonjour`\n\n" +

                "━━━━━━━━━━━━━━━━━━━\n\n" +

                "> *𝐃𝐄𝐕 : 𝐀𝐊𝐀𝐍𝐄 𝐊𝐔𝐑𝐎𝐆𝐀𝐖𝐀*\n\n" +

                "*Voir la chaîne* 🔥\n" +

                `${CHANNEL_LINK}\n\n` +

                "━━━━━━━━━━━━━━━━━━━\n" +

                "> *_© 𝐀𝐊𝐀𝐍𝐄-𝐌𝐃 🌹_*";

            await client.sendMessage(remoteJid, { 

                text: errorMessage  // PLUS DE stylizedChar !

            });

            return;

        }

        if (!languages[targetLang]) {

            const errorMessage = 

                "╔══════════════════╗\n" +

                "    *ERREUR*  \n" +

                "╚══════════════════╝\n\n" +

                "━━━━━━━━━━━━━━━━━━━\n\n" +

                `❌ Langue *${targetLang}* non supportée !\n\n` +

                "📚 *Langues dispo:*\n" +

                `${Object.keys(languages).join(', ')}\n\n` +

                "━━━━━━━━━━━━━━━━━━━\n\n" +

                "> *𝐃𝐄𝐕 : 𝐀𝐊𝐀𝐍𝐄 𝐊𝐔𝐑𝐎𝐆𝐀𝐖𝐀*\n\n" +

                "*Voir la chaîne* 🔥\n" +

                `${CHANNEL_LINK}\n\n` +

                "━━━━━━━━━━━━━━━━━━━\n" +

                "> *_© 𝐀𝐊𝐀𝐍𝐄-𝐌𝐃 🌹_*";

            await client.sendMessage(remoteJid, { 

                text: errorMessage  // PLUS DE stylizedChar !

            });

            return;

        }

        const sourceLang = detectLanguage(textToTranslate);

        const sourceLangInfo = languages[sourceLang] || { name: sourceLang, flag: '🌐' };

        await client.sendMessage(remoteJid, { 

            text: ` 🔄 Traduction ${sourceLangInfo.flag} → ${languages[targetLang].flag}...`

        });

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

                    "    *TRADUCTION*  \n" +

                    "╚══════════════════╝\n\n" +

                    "━━━━━━━━━━━━━━━━━━━\n\n" +

                    "📌 *Texte original*  \n" +

                    `${sourceLangInfo.flag} ${textToTranslate}\n\n` +

                    "━━━━━━━━━━━━━━━━━━━\n\n" +

                    "🎯 *Traduction*  \n" +

                    `${languages[targetLang].flag} ${translatedText}\n\n` +

                    "━━━━━━━━━━━━━━━━━━━\n\n" +

                    "> *𝐃𝐄𝐕 : 𝐀𝐊𝐀𝐍𝐄 𝐊𝐔𝐑𝐎𝐆𝐀𝐖𝐀*\n\n" +

                    "*Voir la chaîne* 🔥\n" +

                    `${CHANNEL_LINK}\n\n` +

                    "━━━━━━━━━━━━━━━━━━━\n" +

                    "> *_© 𝐀𝐊𝐀𝐍𝐄-𝐌𝐃 🌹_*";

                await client.sendMessage(remoteJid, { 

                    text: translationMessage  // PLUS DE stylizedChar !

                });

                return;

            }

        } catch (googleError) {

            console.log('Google Translate échoué, essai MyMemory...');

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

                    "    *TRADUCTION*  \n" +

                    "╚══════════════════╝\n\n" +

                    "━━━━━━━━━━━━━━━━━━━\n\n" +

                    "📌 *Texte original*  \n" +

                    `${sourceLangInfo.flag} ${textToTranslate}\n\n` +

                    "━━━━━━━━━━━━━━━━━━━\n\n" +

                    "🎯 *Traduction*  \n" +

                    `${languages[targetLang].flag} ${translatedText}\n\n` +

                    "━━━━━━━━━━━━━━━━━━━\n\n" +

                    "> *𝐃𝐄𝐕 : 𝐀𝐊𝐀𝐍𝐄 𝐊𝐔𝐑𝐎𝐆𝐀𝐖𝐀*\n\n" +

                    "*Voir la chaîne* 🔥\n" +

                    `${CHANNEL_LINK}\n\n` +

                    "━━━━━━━━━━━━━━━━━━━\n" +

                    "> *_© 𝐀𝐊𝐀𝐍𝐄-𝐌𝐃 🌹_*";

                await client.sendMessage(remoteJid, { 

                    text: translationMessage  // PLUS DE stylizedChar !

                });

                return;

            }

        } catch (memoryError) {

            console.log('MyMemory échoué');

        }

        const errorMessage = 

            "╔══════════════════╗\n" +

            "    *ERREUR*  \n" +

            "╚══════════════════╝\n\n" +

            "━━━━━━━━━━━━━━━━━━━\n\n" +

            "❌ *Impossible de traduire ce texte.*\n\n" +

            "━━━━━━━━━━━━━━━━━━━\n\n" +

            "> *𝐃𝐄𝐕 : 𝐀𝐊𝐀𝐍𝐄 𝐊𝐔𝐑𝐎𝐆𝐀𝐖𝐀*\n\n" +

            "*Voir la chaîne* 🔥\n" +

            `${CHANNEL_LINK}\n\n` +

            "━━━━━━━━━━━━━━━━━━━\n" +

            "> *_© 𝐀𝐊𝐀𝐍𝐄-𝐌𝐃 🌹_*";

        await client.sendMessage(remoteJid, { 

            text: errorMessage  // PLUS DE stylizedChar !

        });

    } catch (error) {

        console.error('Erreur commande traduit:', error);

        

        const errorMessage = 

            "╔══════════════════╗\n" +

            "    *ERREUR*  \n" +

            "╚══════════════════╝\n\n" +

            "━━━━━━━━━━━━━━━━━━━\n\n" +

            `❌ *${error.message}*\n\n` +

            "━━━━━━━━━━━━━━━━━━━\n\n" +

            "> *𝐃𝐄𝐕 : 𝐀𝐊𝐀𝐍𝐄 𝐊𝐔𝐑𝐎𝐆𝐀𝐖𝐀*\n\n" +

            "*Voir la chaîne* 🔥\n" +

            `${CHANNEL_LINK}\n\n` +

            "━━━━━━━━━━━━━━━━━━━\n" +

            "> *_© 𝐀𝐊𝐀𝐍𝐄-𝐌𝐃 🌹_*";

        await client.sendMessage(message.key?.remoteJid, { 

            text: errorMessage  // PLUS DE stylizedChar !

        });

    }

}

export default traduitCommand;