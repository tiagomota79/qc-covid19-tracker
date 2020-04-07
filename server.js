// Import and initiate libraries
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

// Import internal data and components
const scrapers = require('./src/scraper');
const data = require('./src/data');
// Destructuring data from internal components
const { scrape } = scrapers;
const { scrapeCanada } = scrapers;
const { qcPageURL } = data; // This is the Quebec government's page URL for the scraper
const { caPageURL } = data; // This is the Canada government's page URL for the scraper
const { mongoURI } = data; // This is the MongoDB connection URI

console.log(qcPageURL);
console.log(mongoURI);

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

// Initiate body parser and cors
app.use(cors());
app.use(bodyParser.json());

// Allow Express to access the public folder
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile('index.html');
});

app.get('/scrape', async (req, res) => {
  const qcData = await scrape(qcPageURL);
  const caData = await scrapeCanada(caPageURL);
  console.log('Data received from Quebec scraper', qcData);
  console.log('Data received from Canada scraper', caData);

  res.send(JSON.stringify({ qc: qcData, ca: caData }));
});

app.get('/lastdoc', async (req, res) => {
  // Get the documents collection
  const collection = db.collection('total-cases-per-day');

  // Get the last document from the collection
  await collection
    .find({})
    .sort({ _id: -1 })
    .limit(1)
    .toArray(function (err, doc) {
      assert.equal(err, null);
      console.log('Found this document');
      console.log(doc);
      res.send(JSON.stringify(doc));
    });
});

app.get('/alldata', async (req, res) => {
  // Get the documents collection
  const collection = db.collection('total-cases-per-day');
  // Find some documents
  await collection
    .find({})
    .sort({ total: 1 })
    .toArray(function (err, docs) {
      assert.equal(err, null);
      console.log('Found the following records');
      console.log(docs);
      res.send(JSON.stringify(docs));
    });
});

app.get('/updatedb', async (req, res) => {
  const qcData = await scrape(qcPageURL);
  const caData = await scrapeCanada(caPageURL);
  const casesToday = qcData.total;
  const regions = qcData.regions;
  const today = qcData.date;
  console.log('Data received from Quebec scraper', qcData);

  // Get the documents collections
  const totalCasesPerDay = db.collection('total-cases-per-day');
  const casesByRegion = db.collection('cases-by-region');
  const canadaCasesPerDay = db.collection('canada-cases-per-day');

  // Update MongoDB with new data
  totalCasesPerDay.insertOne({ date: today, total: casesToday });
  casesByRegion.insertOne({ date: today, regions });
  canadaCasesPerDay.updateOne(
    { date: today },
    { $set: { date: today, total: caData.total } },
    { upsert: true }
  );

  // Get full total-cases-per-day collection to send to front-end
  totalCasesPerDay
    .find({})
    .sort({ total: 1 })
    .toArray(function (err, docs) {
      assert.equal(err, null);
      console.log('Found the following records');
      console.log(docs);
      res.send(JSON.stringify(docs));
    });
});

app.listen(process.env.PORT || 3000);
