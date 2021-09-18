const express = require('express');
const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

const app = express();

app.get('/', (req, res) => {
  res.send('<a href="/v/https://github.com/vercel/next.js/tree/canary/examples/fast-refresh-demo">jjjjjj</a>');
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
    } 
: {}
);
  
    const page = await browser.newPage();
    page.setUserAgent('Opera/9.80 (J2ME/MIDP; Opera Mini/5.1.21214/28.2725; U; ru) Presto/2.8.119 Version/11.10');
    await page.goto(url, {waitUntil: 'networkidle0'});
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
