import fs from 'fs';
import puppeteer from 'puppeteer';
import scrapeTranslate from './scrapeTranslate.js';
const crawlword = async (word) => {
  console.log('Crawling -> ', word);
  const words = [];
  const linksJson = fs.readFileSync('../output/oxford_links.json');
  const wordlinks = JSON.parse(linksJson);
// const wordlinks=['https://www.oxfordlearnersdictionaries.com/definition/english/above_2']
  const filteredLinks = wordlinks.filter(link => {
    const wordPath = link.split('/').pop();
    const realWord = wordPath.split('-').pop(' ');
    return realWord.startsWith(word);
  });
  console.log(`Found ${filteredLinks.length} links for ${word}`);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(3600 * 1000);

  const total = filteredLinks.length;
  for (const key in filteredLinks) {
    //delay 1s
    await new Promise(resolve => setTimeout(resolve, 0.5 * 1000));
    const link = filteredLinks[key];
    await page.goto(link);
    const word = await page.evaluate(() => {
      return document.querySelector('h1.headword').textContent;
    });
    const pos = await page.evaluate(() => {
      return document.querySelector('span.pos').textContent;
    });
    const phonetic = await page.evaluate(() => {
      const _phonetic = document.querySelector('div.phons_br div.sound');
      return _phonetic.getAttribute('data-src-mp3');
    })

    const phonetic_text = await page.evaluate(() => {
      return document.querySelector('div.phons_br span.phon').textContent;
    })
    const phonetic_am = await page.evaluate(() => {
      const _phonetic_am = document.querySelector('div.phons_n_am div.sound');
      return _phonetic_am.getAttribute('data-src-mp3');
    })
    const phonetic_am_text = await page.evaluate(() => {
      return document.querySelector('div.phons_n_am span.phon').textContent;
    })
    //Get Example
    const senses = await page.evaluate(() => {
      const sensesHTML = document.querySelectorAll('li.sense');
      const sensesArray = [];
      sensesHTML.forEach(sense => {
        const senseObj = {};
        const definition = sense.querySelector('span.def');
        if (definition) {
          senseObj.definition = definition.textContent;
          senseObj.examples = [];
          sense.querySelectorAll('ul.examples li').forEach(example => {
            const cf = example.querySelector('span.cf');
            const x = example.querySelector('span.x');
            const cfContent = cf ? cf.textContent : '';
            const xContent = x ? x.textContent : '';
            if (cfContent || xContent) {
              senseObj.examples.push({
                cf: cfContent,
                x: xContent
              });
            }
          });
          sensesArray.push(senseObj);
        }
      });
      return sensesArray;
    });
    const meaning_vi = await scrapeTranslate(word,pos);
    console.log(`Done ${Number(key) + 1}/${total} links for ${word}`);
    words.push({
      word,
      pos,
      meaning_vi,
      phonetic,
      phonetic_text,
      phonetic_am,
      phonetic_am_text,
      senses
    });
  }
  await browser.close();

  const outputDir = '../output/data';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(`${outputDir}/${word}.json`, JSON.stringify(words, null, 2));
}
// crawlword('h');
export default crawlword;