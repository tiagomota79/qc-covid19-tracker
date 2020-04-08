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
    return Number(cellContents.replace(/\s/g, ''));
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

  // Remove last element from table - the total cases
  casesTable.splice(casesTable.length - 3, 3);

  // Transform table array into javascript object, removing the numbers from the region name and transforming the cases string to number
  let casesTableObject = [];
  casesTable.forEach((item, index, arr) => {
    casesTableObject.push({
      region: arr[index][0].substring(5),
      cases: Number(arr[index][1].replace(/\s/g, '')),
    });
  });

  // Convert the table object into a single object with region names for keys and cases for values, to use in mobile version of chart
  let casesTableMobile = [];
  let casesTableMobileObject = {};
  casesTableObject.forEach((item, index, arr) => {
    casesTableMobileObject[arr[index].region] = arr[index].cases;
  });
  casesTableMobile.push(casesTableMobileObject);

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

  // Convert the cases by age group table object into a single object with region names for keys and cases for values, to use in mobile version of chart
  let casesByAgeTableMobile = [];
  let casesByAgeTableMobileObject = {};
  casesByAgeTableObject.forEach((item, index, arr) => {
    casesByAgeTableMobileObject[arr[index].ageGroup] = arr[index].cases;
  });
  casesByAgeTableMobile.push(casesByAgeTableMobileObject);

  // Gets today's date in YYYY-MM-DD format
  const date = `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }-${new Date().getDate()}`;

  dataObj = {
    date: date,
    total,
    regions: casesTableObject,
    regionsMobile: casesTableMobile,
    casesByAge: casesByAgeTableObject,
    casesByAgeMobile: casesByAgeTableMobile,
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

//Export the function to be used in other files.
module.exports = scrape;
