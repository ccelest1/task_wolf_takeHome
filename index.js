// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
import * as playwright from 'playwright';
import { openFrontendHtml, dataIngest, return_done } from "./src/index.js";

async function sortHackerNewsArticles() {
  // launch browser
  for (const browserType of ['firefox']) {
    const browser = await playwright[browserType].launch({ headless: false });
    const context = await browser.newContext();
    const page_hackerNews = await context.newPage();

    // go to Hacker News
    await page_hackerNews.goto("https://news.ycombinator.com/newest");
    const uiPage = await openFrontendHtml(context)


    try {
      const tbody = page_hackerNews.locator('.subtext .subline span.age');
      let evalTitles = [];

      while (evalTitles.length < 100) {
        const titles = await tbody.evaluateAll(
          elements => elements.map(element => element.title)
        );
        for (const title of titles) {
          let newDate = new Date(title.split(" ")[0])
          if (evalTitles.length > 0) {
            let lastDate = evalTitles[evalTitles.length]
            if (newDate < lastDate) {
              throw new Error('Found a Date Out of Order')
            }
          }
          if (evalTitles.length < 100) {
            console.log(newDate)
            await dataIngest(uiPage, evalTitles, newDate)
            evalTitles.push(newDate)
            await page_hackerNews.waitForTimeout(1000)
          }
        }

        if (evalTitles.length < 100) {
          await uiPage.bringToFront();
          await page_hackerNews.evaluate(() => {
            document.querySelector('a.morelink').click();
          })
          await page_hackerNews.waitForTimeout(1000); // wait for load
        }
        if (evalTitles === 100) {
          break
        }
      }
      if (await return_done(uiPage)) {
        await browser.close();
      }
      console.log('Dates are sorted from newest to oldest')
    } catch (e) {
      console.error('Error', e)
    } finally {
      console.log('Done')
    }
  }

}

(async () => {
  await sortHackerNewsArticles();
})();


export default sortHackerNewsArticles;
