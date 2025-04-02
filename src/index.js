import crawlword from './crawlword.js';
import { scrapeLink } from './scrape.js'

// scrapeLink().then(() => {
//   console.log('Scraping done');
// }).catch(err => {
//   console.log('Scraping failed', err);
// });

const groupByWords = async (alphabet) => {
  for (const idx in alphabet) {
    await crawlword(alphabet[idx]);
  }
  return 'Crawling alphabet completed';
}
//jkquxyzvnog
//a b c d e f h i l m p r s t w
groupByWords('h').then((noti) => {
  console.log(noti);
}).catch(err => console.log('Crawling failed', err))
