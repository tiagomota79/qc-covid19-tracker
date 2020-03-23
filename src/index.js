const data = require('./data');
const { pageURL } = data;

const scrape = require('./scraper');
const compareAndSave = require('./results');

scrape(pageURL)
  .then(dataObj => {
    compareAndSave(dataObj);
  })
  .catch(console.error);
