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
//jkquxyzvn
//a b c d e f g h i l m o p r s t w
groupByWords('o').then((noti) => {
  console.log(noti);
}).catch(err => console.log('Crawling failed', err))
