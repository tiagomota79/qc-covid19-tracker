// Import internal data and components
const scrape = require('./src/scraper');
const scrapeCanada = require('./src/scrapeCanada');
const data = require('./src/data');
// Destructuring data from internal component
const { pageURL } = data; // This is the Quebec government's page URL for the scraper
const { canadaURL } = data; // This is the Canada government's page URL for the scraper
const { mongoURI } = data; // This is the MongoDB connection URI

console.log('pageURL', pageURL);
console.log('canadaURL', canadaURL);
console.log('mongoURI', mongoURI);

// Connect to MongoDB
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// DB object to be used by MongoDB
let db;

// Database Name
const dbName = 'qc-coronavirus-cases';

// Create a new MongoClient
const client = new MongoClient(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Use connect method to connect to the Server
client.connect(function (err) {
  assert.equal(null, err);
  console.log('Connected successfully to MongoDB server');

  db = client.db(dbName);
});

// Get data and update DB
async function getData() {
  // Get data from scrapers
  const qcData = await scrape(pageURL);
  const caData = await scrapeCanada(canadaURL);

  // Assign each data to a variable
  const today = qcData.date;
  const total = qcData.total;
  const regions = qcData.regions;
  const casesByAge = qcData.casesByAge;
  const tests = qcData.incListArray;
  const hospitalizations = qcData.hospListArray;
  const deaths = qcData.deaths;
  const deathsByRegion = qcData.deathsByRegion;
  const deathsByAge = qcData.deathsByAge;
  //   const caTotal = caData.total;
  //   const caPobable = caData.probable;
  //   const caTested = caData.tested;
  //   const caDeaths = caData.deaths;

  // Function to get the documents collections and update the DB
  function updateCollection(collection, data) {
    const collectionToUpdate = db.collection(collection);

    collectionToUpdate.updateOne(
      { date: today },
      { $set: { date: today, data } },
      { upsert: true }
    );
  }

  // Update every collection in the DB
  updateCollection('totalCasesPerDay', total);
  updateCollection('casesByRegion', regions);
  updateCollection('casesByAgeGroup', casesByAge);
  updateCollection('tests', tests);
  updateCollection('hospitalization', hospitalizations);
  updateCollection('totalDeaths', deaths);
  updateCollection('deathsByRegion', deathsByRegion);
  updateCollection('deathsByAge', deathsByAge);
  updateCollection('canadaData', caData);
}

(async function () {
  await getData();
})();
