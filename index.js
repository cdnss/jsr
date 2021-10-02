const express = require('express');
const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

const app = express();

app.get('/', (req, res) => {
 res.send('<a href="/v/https://d21.run/">jjjjjj</a>');
});

app.get('/v/*', async (req, res) => {
 const urll = req.url;
 if (!urll) {
  return res.send('please provide url');
 }
 let url = urll.replace('/v/', '');
 try {
  const browser = await puppeteer.launch(
   process.env.NODE_ENV === 'production'
   ? {


    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: false, //chrome.headless,
    ignoreHTTPSErrors: true,
    defaultViewPorts: {
     isMobile: true
    },

   }: {}
  );
  browser.defaultBrowserContext();
  const page = await browser.newPage();

  await page.setExtraHTTPHeaders({
   'upgrade-insecure-requests': '1'
  });

  await page.goto(url, {
   waitUntil: 'networkidle0', timeout: 30000
  });
  const pageContent = await page.content();
  console.log(`Response first 200 chars from ${url} : ${pageContent.substring(0, 200)}`);
  await browser.close();

  res.send(pageContent);
 } catch (err) {
  console.log(`Error while fetching ${url} `, err);
  res.send(`Error fetching ${url}`);
 }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
 console.log(`Listening on port ${PORT}`);
});