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

groupByWords('uv').then((noti) => {
  console.log(noti);
}).catch(err => console.log('Crawling failed', err))
