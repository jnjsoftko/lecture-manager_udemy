import puppeteer from 'puppeteer-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';
import { executablePath } from 'puppeteer';

puppeteer.use(stealthPlugin());

const url = 'https://books.toscrape.com';

const main = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: executablePath(),
    slowMo: 30,
  });
  const page = await browser.newPage();
  await page.goto(url);

  const bookData = await page.evaluate((url) => {
    const bookPods = Array.from(document.querySelectorAll('.product_pod'));
    const data = bookPods.map((book: any) => ({
      title: book.querySelector('h3 a').getAttribute('title'), 
      price: book.querySelector('.price_color').innerText,
      imgSrc: url + book.querySelector('img').getAttribute('src'),
      rating: book.querySelector('.star-rating').classList[1]
    }));
    return data
  }, url);

  console.log(bookData);

  await browser.close();
}

main();