const puppeteer = require('puppeteer');

async function scrape(url) {
  //Initiate Puppeteer browser and direct to the URL
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto(url);

  // Get total cases from the government webpage, remove the whitespace and convert to number
  const total = await page.evaluate(() => {
    const cellContents = document.querySelector(
      '.contenttable tbody tr:last-of-type td:last-of-type'
    ).textContent;
    return Number(cellContents.replace(/\s/g, '').match(/(\d+)/g)[0]);
  });

  // Get full cases table from government webpage
  const casesTable = await page.evaluate(() => {
    const rows = document.querySelectorAll(
      '#c50214 > div > div > div > table > tbody tr'
    );
    return Array.from(rows, (row) => {
      const columns = row.querySelectorAll('td');
      return Array.from(columns, (column) => column.innerText);
    });
  });

  // Transform table array into javascript object, removing the numbers from the region name and transforming the cases string to number
  let casesTableObject = [];
  casesTable.forEach((item, index, arr) => {
    casesTableObject.push({
      region: arr[index][0].replace(/(\d)*(\s)-\2/g, ''),
      cases: Number(arr[index][1].replace(/\s/g, '')),
    });
  });

  casesTableObject.pop();

  // Get cases by age group table
  const casesByAgeTable = await page.evaluate(() => {
    const rows = document.querySelectorAll(
      '#c50213 > div > div > div > table > tbody tr'
    );
    return Array.from(rows, (row) => {
      const columns = row.querySelectorAll('td');
      return Array.from(columns, (column) => column.innerText);
    });
  });

  // Transform cases by age table array into javascript object, removing the numbers from the region name and transforming the cases string to number
  let casesByAgeTableObject = [];
  casesByAgeTable.forEach((item, index, arr) => {
    casesByAgeTableObject.push({
      ageGroup: arr[index][0],
      cases: Number(arr[index][1].replace(/,/g, '.').replace(/(\s%)/g, '')),
    });
  });

  // Scrape investigation/negative/confirmed list
  const incListObj = {};
  let incList = await page.evaluate(() => {
    const listItems = document.querySelectorAll(
      '#c50212 > div > div > ul > li'
    );
    return Array.from(listItems, (listItem) => listItem.innerText);
  });

  incList.forEach((item, index, arr) => {
    incListObj[incList[index].match(/[^\:]*/)[0].replace(/\d/g, '')] = Number(
      incList[index].replace(/[^:]*:\s/, '').replace(/\s/g, '')
    );
  });

  let incListArray = [];
  incList.forEach((item, index, arr) => {
    incListArray.push({
      number: incList[index].match(/[^\:]*/)[0].replace(/\d/g, ''),
      value: (alue = Number(
        incList[index].replace(/[^:]*:\s/, '').replace(/\s/g, '')
      )),
    });
  });

  incListArray[0].number = 'Under investigation';
  incListArray[1].number = 'Negative';
  incListArray[2].number = 'Positive';

  // Scrape hospitalization list
  const hospListObj = {};
  let hospList = await page.evaluate(() => {
    const listItems = document.querySelectorAll(
      '#c50210 > div > div > ul > li'
    );
    return Array.from(listItems, (listItem) => listItem.innerText);
  });

  hospList.forEach((item, index, arr) => {
    hospListObj[hospList[index].match(/[^\:]*/)[0].replace(/\d/g, '')] = Number(
      hospList[index].replace(/[^:]*:\s/, '').replace(/\s/g, '')
    );
  });

  let hospListArray = [];
  hospList.forEach((item, index, arr) => {
    hospListArray.push({
      number: hospList[index].match(/[^\:]*/)[0].replace(/\d/g, ''),
      value: (alue = Number(
        hospList[index].replace(/[^:]*:\s/, '').replace(/\s/g, '')
      )),
    });
  });

  hospListArray[0].number = 'Regular';
  hospListArray[1].number = 'Intensive care';
  hospListArray[2].number = 'Total';

  // Scrape deaths by region table
  const deathsByRegionTable = await page.evaluate(() => {
    const rows = document.querySelectorAll(
      '#c51880 > div > div > div > table > tbody tr'
    );
    return Array.from(rows, (row) => {
      const columns = row.querySelectorAll('td');
      return Array.from(columns, (column) => column.innerText);
    });
  });

  // Transform table array into javascript object, removing the numbers from the region name and transforming the cases string to number
  let deathsByRegionTableObject = [];
  deathsByRegionTable.forEach((item, index, arr) => {
    deathsByRegionTableObject.push({
      region: arr[index][0].replace(/(\d)*(\s)-\2/g, ''),
      deaths: Number(arr[index][1].replace(/\s/g, '').match(/(\d+)/g)[0]),
    });
  });

  let totalDeaths = deathsByRegionTableObject.pop().deaths; // Removes last value - total deaths - from deaths by region table and assign it to new variable

  // Get deaths by age group table
  const deathsByAgeTable = await page.evaluate(() => {
    const rows = document.querySelectorAll(
      '#c51881 > div > div > div > table > tbody tr'
    );
    return Array.from(rows, (row) => {
      const columns = row.querySelectorAll('td');
      return Array.from(columns, (column) => column.innerText);
    });
  });

  // Transform cases by age table array into javascript object, removing the numbers from the region name and transforming the cases string to number
  let deathsByAgeTableObject = [];
  deathsByAgeTable.forEach((item, index, arr) => {
    deathsByAgeTableObject.push({
      ageGroup: arr[index][0],
      deaths: Number(arr[index][1].replace(/,/g, '.').replace(/(\s%)/g, '')),
    });
  });

  // Gets today's date in YYYY-MM-DD format
  const date = `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }-${new Date().getDate()}`;

  dataObj = {
    date: date,
    total,
    regions: casesTableObject,
    casesByAge: casesByAgeTableObject,
    incListArray: incListArray,
    hospListArray: hospListArray,
    deaths: totalDeaths,
    deathsByRegion: deathsByRegionTableObject,
    deathsByAge: deathsByAgeTableObject,
  };

  console.log('dataObj from scraper', dataObj);

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

// 'Negative cases2: 99 239'.replace(/[^:]*:\s/, '').replace(/\s/g, '') // gets only the final number without whitespace
// 'Negative cases2: 99 239'.match(/[^\:]*/)[0].replace(/\d/g, '') // gets only the text before the collon without the number (if there's one)

//originArray.forEach((item, index, arr) => {targetArray[originArray[index].match(/[^\:]*/)[0].replace(/\d/g, '')] = Number(originArray[index].replace(/[^:]*:\s/, '').replace(/\s/g, ''))}) // Transform an array of strings like the above into a new array of format [text before collon]: number

//Export the function to be used in other files.
module.exports = scrape;
