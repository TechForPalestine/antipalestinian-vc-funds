const cheerio = require('cheerio');
const fs = require('fs');
const genocide_vc_url = process.env.GVCURL || "https://docs.google.com/document/d/e/2PACX-1vTc_OIs8MSVxqz0To2diHiDd_UIQBg_wBHLnmIQNtoTRQaFrC2ZcUWiOqR7dHMe2KnfnU-Bi7n-1XpW/pub"

async function checkGenocideVcList() {
    const response = await fetch(genocide_vc_url);
    const html = await response.text(); // HTML string
    const $ = cheerio.load(html);
    let pTextArr = []
    $('p').each((i, elem) => {
        const text = $(elem).text().trim();
        pTextArr.push(text)
    });
    pTextArr = pTextArr.join('\n').split('\n').filter(x => x)
    const currentSigIndex = pTextArr.findIndex(x => x.includes('Current Signatories:'))
    const signatories = pTextArr.slice(currentSigIndex + 1)
    const jsonSignatories = JSON.stringify(signatories, null, 2);
    console.log(jsonSignatories);
    console.log(`Current Signatories: ${signatories.length}`);
    fs.writeFile('signatories.json', jsonSignatories, (err) => {
        if (err) {
            console.error(err);
        }
    });
}
checkGenocideVcList() 