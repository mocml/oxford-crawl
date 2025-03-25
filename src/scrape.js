import puppeteer from "puppeteer";
import fs from 'fs';
const scrapeLink = async (outputFile = '../output/oxford_links.json') => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://www.oxfordlearnersdictionaries.com/wordlists/oxford3000-5000", { waitUntil: 'domcontentloaded' });

  const links = await page.evaluate(() => {
    const ulElement = document.querySelectorAll('ul.top-g');
    const hrefArray = [];
    ulElement.forEach(ul => {
      ul.querySelectorAll('li a').forEach(a => {
        hrefArray.push(a.href);
      });
    });
    return hrefArray
  })
  const outputdDir = outputFile.substring(0, outputFile.lastIndexOf('/'));
  if (outputdDir && !fs.existsSync(outputdDir)) {
    fs.mkdirSync(outputdDir, { recursive: true });
  }
  fs.writeFileSync(outputFile, JSON.stringify(links, null, 2));
  await browser.close();
  console.log("Links saved to " + outputFile);
}
export { scrapeLink };