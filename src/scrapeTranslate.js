import puppeteer from "puppeteer";

const scrapeTranslate = async (word, _pos) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`https://dictionary.cambridge.org/dictionary/english-vietnamese/${word}`, { waitUntil: 'domcontentloaded' });
  // const meaning = await page.evaluate(() => {
  //   const dictionaryElement = document.querySelector('span.trans.dtrans').textContent;
  //   return dictionaryElement
  // })
  const dics = await page.evaluate(() => {
    const arr = [];;
    const dictionaryElement = document.querySelectorAll('span.link.dlink');
    dictionaryElement.forEach(w => {
      const wordObj = {}
      const pos = w.querySelector('span.pos.dpos').textContent
      let meaning_vi = '';
      const means = w.querySelectorAll('.sense-block.pr.dsense')
      means.forEach(mean => {
        const m = mean.querySelector('span.trans.dtrans').textContent;
        meaning_vi += m + '; ';
      })
      wordObj.pos = pos;
      wordObj.meaning_vi = meaning_vi.trim();
      arr.push(wordObj);
    })
    return arr
  })
  await browser.close()
  console.log(dics);
  console.log(_pos);
  const samePos = dics.find(dic => _pos.includes(dic.pos))?.meaning_vi ?? null;
  return samePos || dics[0].meaning_vi;
}
// console.log(await scrapeTranslate('above', 'adverb'));
export default scrapeTranslate;