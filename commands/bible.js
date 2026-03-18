import axios from 'axios';

import stylizedChar from '../utils/fancy.js';

const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbBzhyQ4NVisPH1NSe1R';

// Mapping des livres fran莽ais 鈫� anglais

const bibleBooks = {

    'gen猫se': 'Genesis', 'genese': 'Genesis',

    'exode': 'Exodus',

    'l茅vitique': 'Leviticus', 'levitique': 'Leviticus',

    'nombres': 'Numbers',

    'deut茅ronome': 'Deuteronomy', 'deuteronome': 'Deuteronomy',

    'josu茅': 'Joshua', 'josue': 'Joshua',

    'juges': 'Judges',

    'ruth': 'Ruth',

    '1 samuel': '1 Samuel', 'i samuel': '1 Samuel',

    '2 samuel': '2 Samuel', 'ii samuel': '2 Samuel',

    '1 rois': '1 Kings', 'i rois': '1 Kings',

    '2 rois': '2 Kings', 'ii rois': '2 Kings',

    '1 chroniques': '1 Chronicles', 'i chroniques': '1 Chronicles',

    '2 chroniques': '2 Chronicles', 'ii chroniques': '2 Chronicles',

    'esdras': 'Ezra',

    'n茅h茅mie': 'Nehemiah', 'nehemie': 'Nehemiah',

    'esther': 'Esther',

    'job': 'Job',

    'psaumes': 'Psalms', 'psaume': 'Psalms',

    'proverbes': 'Proverbs',

    'eccl茅siaste': 'Ecclesiastes', 'ecclesiaste': 'Ecclesiastes',

    'cantique': 'Song of Solomon',

    '茅sa茂e': 'Isaiah', 'esaie': 'Isaiah',

    'j茅r茅mie': 'Jeremiah', 'jeremie': 'Jeremiah',

    'lamentations': 'Lamentations',

    '茅z茅chiel': 'Ezekiel', 'ezechiel': 'Ezekiel',

    'daniel': 'Daniel',

    'os茅e': 'Hosea', 'osee': 'Hosea',

    'jo毛l': 'Joel', 'joel': 'Joel',

    'amos': 'Amos',

    'abdias': 'Obadiah',

    'jonas': 'Jonah',

    'mich茅e': 'Micah', 'michee': 'Micah',

    'nahum': 'Nahum',

    'habacuc': 'Habakkuk',

    'sophonie': 'Zephaniah',

    'agg茅e': 'Haggai', 'aggee': 'Haggai',

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

    '茅ph茅siens': 'Ephesians', 'ephesiens': 'Ephesians',

    'philippiens': 'Philippians',

    'colossiens': 'Colossians',

    '1 thessaloniciens': '1 Thessalonians', 'i thessaloniciens': '1 Thessalonians',

    '2 thessaloniciens': '2 Thessalonians', 'ii thessaloniciens': '2 Thessalonians',

    '1 timoth茅e': '1 Timothy', 'i timoth茅e': '1 Timothy',

    '2 timoth茅e': '2 Timothy', 'ii timoth茅e': '2 Timothy',

    'tite': 'Titus',

    'phil茅mon': 'Philemon', 'philemon': 'Philemon',

    'h茅breux': 'Hebrews', 'hebreux': 'Hebrews',

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

                "鈺斺晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晽\n" +

                "    *VERSET BIBLIQUE*  \n" +

                "鈺氣晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨暆\n\n" +

                "鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹乗n\n" +

                "馃摑 *Utilisation:*\n" +

                "`.save [r茅f茅rence]`\n\n" +

                "馃搶 *Exemples:*\n" +

                "`.save Exode 2`\n" +

                "`.save Jean 3:16`\n" +

                "`.save Psaume 23`\n\n" +

                "鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹乗n\n" +

                "> *饾悆饾悇饾悤 : 饾悁饾悐饾悁饾悕饾悇 饾悐饾悢饾悜饾悗饾悊饾悁饾悥饾悁*\n\n" +

                "*Voir la cha卯ne* 馃敟\n" +

                `${CHANNEL_LINK}\n\n` +

                "> *_漏 饾悁饾悐饾悁饾悕饾悇-饾悓饾悆 馃尮_*";

            return await client.sendMessage(remoteJid, { text: helpMessage });

        }

        await client.sendMessage(remoteJid, { 

            text: stylizedChar(` 馃攳 Recherche de "${args}"...`)

        });

        // Traduire la r茅f茅rence en anglais

        const englishRef = translateReference(args);

        

        // === 脡TAPE 1: R脡CUP脡RER LE VERSET EN ANGLAIS ===

        const apiUrl = `https://labs.bible.org/api/?passage=${encodeURIComponent(englishRef)}&type=json`;

        const response = await axios.get(apiUrl, { timeout: 10000 });

        if (!response.data || response.data.length === 0) {

            throw new Error('Verset non trouv茅');

        }

        const verseData = response.data[0];

        const bookname = verseData.bookname;

        const chapter = verseData.chapter;

        const verse = verseData.verse;

        const englishText = verseData.text.replace(/\(.*?\)/g, '').trim();

        // === 脡TAPE 2: TRADUIRE EN FRAN脟AIS AVEC GOOGLE TRANSLATE ===

        const translateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fr&dt=t&q=${encodeURIComponent(englishText)}`;

        const translateResponse = await axios.get(translateUrl, { timeout: 10000 });

        

        // Extraire la traduction

        let frenchText = '';

        if (translateResponse.data && translateResponse.data[0]) {

            frenchText = translateResponse.data[0].map(item => item[0]).join(' ');

        }

        if (!frenchText) {

            throw new Error('Traduction 茅chou茅e');

        }

        const bibleMessage = 

            "鈺斺晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晽\n" +

            "    *VERSET BIBLIQUE*  \n" +

            "鈺氣晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨暆\n\n" +

            "鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹乗n\n" +

            `馃摉 *${bookname} ${chapter}:${verse}*\n\n` +

            `"${frenchText}"\n\n` +

            "馃搶 _Version fran莽aise (traduction automatique)_\n\n" +

            "鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹乗n\n" +

            "> *饾悆饾悇饾悤 : 饾悁饾悐饾悁饾悕饾悇 饾悐饾悢饾悜饾悗饾悊饾悁饾悥饾悁*\n\n" +

            "*Voir la cha卯ne* 馃敟\n" +

            `${CHANNEL_LINK}\n\n` +

            "> *_漏 饾悁饾悐饾悁饾悕饾悇-饾悓饾悆 馃尮_*";

        await client.sendMessage(remoteJid, { 

            text: bibleMessage

        });

    } catch (error) {

        console.error('Erreur save:', error);

        

        const errorMessage = 

            "鈺斺晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晽\n" +

            "    *ERREUR*  \n" +

            "鈺氣晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨暆\n\n" +

            "鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹乗n\n" +

            "鉂� *Verset non trouv茅*\n\n" +

            "馃摑 *V茅rifie la r茅f茅rence ou r茅essaie plus tard*\n\n" +

            "鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹佲攣鈹乗n\n" +

            "> *饾悆饾悇饾悤 : 饾悁饾悐饾悁饾悕饾悇 饾悐饾悢饾悜饾悗饾悊饾悁饾悥饾悁*\n\n" +

            "*Voir la cha卯ne* 馃敟\n" +

            `${CHANNEL_LINK}\n\n` +

            "> *_漏 饾悁饾悐饾悁饾悕饾悇-饾悓饾悆 馃尮_*";

        await client.sendMessage(message.key?.remoteJid, { 

            text: errorMessage

        });

    }

}

export default saveCommand;