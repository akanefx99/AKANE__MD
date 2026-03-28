// commands/web.js

// @cat: media

// Recherche de sites web

const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbBzhyQ4NVisPH1NSe1R';

const CHANNEL_NAME = '🍁𝐃𝐎̈𝐎̃𝐌 𝐒𝐓𝐈𝐂𝐊𝐄𝐑𝐒 🌹';

// Liste des sites populaires avec leurs URLs

const popularSites = {

    // Streaming

    "anime sama": "https://anime-sama.to",

    "animesama": "https://anime-sama.to",

    "crunchyroll": "https://www.crunchyroll.com/fr",

    "netflix": "https://www.netflix.com",

    "disney plus": "https://www.disneyplus.com",

    "prime video": "https://www.primevideo.com",
    "voiranime": "https://voiranime.tv/",

    "youtube": "https://www.youtube.com",

    "twitch": "https://www.twitch.tv",

    "spotify": "https://www.spotify.com",

    "deezer": "https://www.deezer.com",

    // Dans popularSites, ajoute correctement :
"adblock": "https://adblockplus.org",
"adblock plus": "https://adblockplus.org",
"adblock browser": "https://play.google.com/store/apps/details?id=org.adblockplus.browser",

    // Réseaux sociaux

    "whatsapp web": "https://web.whatsapp.com",

    "instagram": "https://www.instagram.com",

    "facebook": "https://www.facebook.com",

    "twitter": "https://twitter.com",

    "tiktok": "https://www.tiktok.com",

    "snapchat": "https://www.snapchat.com",

    "telegram": "https://web.telegram.org",

    "discord": "https://discord.com",

    "reddit": "https://www.reddit.com",

    "pinterest": "https://www.pinterest.com",

    "linkedin": "https://www.linkedin.com",

    

    // Google

    "google": "https://www.google.com",

    "gmail": "https://mail.google.com",

    "drive": "https://drive.google.com",

    "maps": "https://maps.google.com",

    "translate": "https://translate.google.com",

    "youtube music": "https://music.youtube.com",

    "photos": "https://photos.google.com",

    

    // Microsoft

    "bing": "https://www.bing.com",

    "outlook": "https://outlook.live.com",

    "office": "https://www.office.com",

    "teams": "https://teams.microsoft.com",

    

    // E-commerce

    "amazon": "https://www.amazon.fr",

    "jumia": "https://www.jumia.sn",

    "aliexpress": "https://www.aliexpress.com",

    "shein": "https://www.shein.com",

    "temu": "https://www.temu.com",

    "ebay": "https://www.ebay.fr",

    

    // Actualités

    "lemonde": "https://www.lemonde.fr",

    "lefigaro": "https://www.lefigaro.fr",

    "liberation": "https://www.liberation.fr",

    "seneweb": "https://www.seneweb.com",

    "dakaractu": "https://www.dakaractu.com",

    

    // Sport

    "livescore": "https://www.livescore.com",

    "flashscore": "https://www.flashscore.fr",

    "lequipe": "https://www.lequipe.fr",

    "goal": "https://www.goal.com",

    

    // Technologie

    "github": "https://github.com",

    "gitlab": "https://gitlab.com",

    "stackoverflow": "https://stackoverflow.com",

    "wikipedia": "https://www.wikipedia.org",

    "wikipédia": "https://fr.wikipedia.org",

    

    // Téléchargement

    "y2mate": "https://y2mate.com",

    "savefrom": "https://en.savefrom.net",

    "pinterest downloader": "https://pintodown.com",

    

    // Autres

    "chatgpt": "https://chat.openai.com",

    "deepseek": "https://chat.deepseek.com",

    "mistral": "https://chat.mistral.ai",

    "canva": "https://www.canva.com",

    "pixabay": "https://pixabay.com",

    "unsplash": "https://unsplash.com",

    "wetransfer": "https://wetransfer.com",

    "mediafire": "https://www.mediafire.com",

    "mega": "https://mega.nz"

};

async function webCommand(client, message, args) {

    const remoteJid = message.key.remoteJid;

    const query = args.join(' ').toLowerCase().trim();

    

    // ========== HELP ==========

    if (!query) {

        const helpText = 

`🌐 *WEB SEARCH*

📝 *COMMANDE :*

• *web [nom du site]* - Envoie le lien du site

💡 *EXEMPLES :*

• *web anime sama*

• *web crunchyroll*

• *web youtube*

• *web whatsapp web*

• *web github*

🔍 *RECHERCHE :*

Si le site n'est pas dans ma base, je te propose une recherche Google

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📢 *REJOINS MA CHAÎNE* 🔥

*${CHANNEL_NAME}*

${CHANNEL_LINK}

> *DEV : AKANE KUROGAWA🌹*`;

        

        await client.sendMessage(remoteJid, { text: helpText });

        return;

    }

    

    // Rechercher dans la base

    let foundUrl = null;

    let foundName = null;

    

    // Recherche exacte

    if (popularSites[query]) {

        foundUrl = popularSites[query];

        foundName = query;

    } else {

        // Recherche approximative

        for (const [key, url] of Object.entries(popularSites)) {

            if (key.includes(query) || query.includes(key)) {

                foundUrl = url;

                foundName = key;

                break;

            }

        }

    }

    

    if (foundUrl) {

        const resultText = 

`🌐 *${foundName.toUpperCase()}*

━━━━━━━━━━━━━━━━━━━━

🔗 *LIEN :*

${foundUrl}

💡 *Clique pour accéder au site*

━━━━━━━━━━━━━━━━━━━━

📢 *REJOINS MA CHAÎNE* 🔥

*${CHANNEL_NAME}*

${CHANNEL_LINK}

> *DEV : AKANE KUROGAWA🌹*`;

        

        await client.sendMessage(remoteJid, { text: resultText });

        return;

    }

    

    // Si non trouvé, proposer une recherche Google

    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    

    const notFoundText = 

`🔍 *RECHERCHE GOOGLE*

━━━━━━━━━━━━━━━━━━━━

❌ *"${query}"* non trouvé dans ma base

🔗 *LIEN DE RECHERCHE :*

${searchUrl}

💡 *Sites populaires :*

• anime sama, crunchyroll, netflix

• youtube, spotify, twitch

• whatsapp web, instagram, facebook

• github, wikipedia, chatgpt

━━━━━━━━━━━━━━━━━━━━

📢 *REJOINS MA CHAÎNE* 🔥

*${CHANNEL_NAME}*

${CHANNEL_LINK}

> *DEV : AKANE KUROGAWA🌹*`;

    

    await client.sendMessage(remoteJid, { text: notFoundText });

}

export default webCommand;