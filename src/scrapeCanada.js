const puppeteer = require('puppeteer');

async function scrapeCanada(url) {
  //Initiate Puppeteer browser and direct to the URL
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto(url);

  // Get number of people tested from the government webpage, remove the comma and convert to number
  const tested = await page.evaluate(() => {
    const totalCanada = document.querySelector(
      '#wb-auto-5 > div.col-md-4 > section > p.h2.mrgn-tp-md'
    ).textContent;
    return Number(totalCanada.replace(/,/g, ''));
  });

  // Get total cases from the government webpage, remove the comma and convert to number
  const total = await page.evaluate(() => {
    const totalCanada = document.querySelector(
      '#wb-auto-5 > div:nth-child(2) > section > p.h2.mrgn-tp-md'
    ).textContent;
    return Number(totalCanada.replace(/,/g, ''));
  });

  // Get probable cases from the government webpage, remove the comma and convert to number
  const probable = await page.evaluate(() => {
    const totalCanada = document.querySelector(
      '#wb-auto-5 > div:nth-child(3) > section > p.h2.mrgn-tp-md'
    ).textContent;
    return Number(totalCanada.replace(/,/g, ''));
  });

  // Get deaths from the government webpage, remove the comma and convert to number
  const deaths = await page.evaluate(() => {
    const totalCanada = document.querySelector(
      '#wb-auto-5 > div.col-md-2 > section > p.h2.mrgn-tp-md'
    ).textContent;
    return Number(totalCanada.replace(/,/g, ''));
  });

  dataObj = {
    tested,
    total,
    probable,
    deaths,
  };

  console.log('data from Canada scraper', dataObj);

  //Error catching
  try {
  } catch (e) {
    console.log(e);
  }

  //Close Puppeteer browser after scraping data
  await browser.close();
  // Return data object
  return dataObj;
}

//Export the function to be used in other files.
module.exports = scrapeCanada;
