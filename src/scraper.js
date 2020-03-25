const puppeteer = require('puppeteer');

let data = [
  {
    date: '2020-3-8',
    total: 0,
  },
  {
    date: '2020-3-9',
    total: 2,
  },
  {
    date: '2020-3-11',
    total: 7,
  },
  {
    date: '2020-3-12',
    total: 9,
  },
  {
    date: '2020-3-13',
    total: 17,
  },
  {
    date: '2020-3-14',
    total: 21,
  },
  {
    date: '2020-3-16',
    total: 41,
  },
  {
    date: '2020-3-17',
    total: 71,
  },
  {
    date: '2020-3-18',
    total: 94,
  },
  {
    date: '2020-3-19',
    total: 121,
  },
  {
    date: '2020-3-20',
    total: 139,
  },
];

async function scrape(url) {
  //Initiate Puppeteer browser and direct to the URL
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  // await page.waitForXPath(
  //   '//*[@id="c47903"]/div/div/div/table/tbody/tr[15]/td[2]/p'
  // );

  // const jsHandle = await page.evaluateHandle(() => {
  //   const [el] = page.$x('//*[@id="c47903"]/div/div/div/table');
  //   return el;
  // });
  // console.log('jsHandle', jsHandle); // JSHandle

  // //Get specific element from page using xPath
  // const [el] = await page.$x('//*[@id="c47903"]/div/div/div/table');

  // // Get property from the selected webpage element, using textContent
  // const table = await JSON.parse(
  //   JSON.stringify(xPath)
  // )._remoteObject.value.getProperty('textContent');
  // console.log('table', table);
  // // Convert the response to a json object
  // const tableJson = await table.jsonValue();
  // // Filter only the Total value
  // const filter = tableJson.substr(tableJson.indexOf('Total') + 5);
  // // Remove whitespace from number
  // const noWhitespace = filter.trim();
  // // Convert the string value into number
  // const total = await Number(noWhitespace);

  const total = await page.evaluate(() => {
    const cellContents = document.querySelector(
      '.contenttable tbody tr:last-of-type td:last-of-type'
    ).textContent;
    return Number(cellContents.replace(/\s/g, ''));
  });

  // Gets today's date in YYYY-MM-DD format
  const date = `${new Date().getFullYear()}-${new Date().getMonth() +
    1}-${new Date().getDate()}`;

  console.log(total);

  // console.log('dataObj inside scraper', { date, total }); //Check the object created with today's date and the number scrapped from the website

  // console.log('Dataset situation after page loads', data); //Check the pushing of the new object into the initial dataset

  dataObj = {
    date: date,
    total,
  };

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

// Function executed with the website from QC government. This will be integrated into another file when the app is finished.
scrape(
  'https://www.quebec.ca/sante/problemes-de-sante/a-z/coronavirus-2019/situation-coronavirus-quebec/'
);

//Export the function to be used in other files.
module.exports = scrape;
