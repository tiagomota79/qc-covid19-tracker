// Import and initiate libraries
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Import internal data and components
const scrape = require('./src/scraper');
const data = require('./src/data');
const initialData = require('./src/initialData.json');
// Destructuring data from internal component
const { pageURL } = data;
const { mongoURI } = data;

console.log(pageURL);
console.log(mongoURI);

// Connect to MongoDB
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = mongoURI;

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
client.connect(function(err) {
  assert.equal(null, err);
  console.log('Connected successfully to MongoDB server');

  db = client.db(dbName);
});

// Initiate body parser
app.use(bodyParser.json());

app.use('/', express.static('build')); // Needed for the HTML and JS files
app.use('/', express.static('public')); // Needed for local assets

// Routes
// app.get('/', function(req, res) {
//   res.redirect('/scrape');
// });

app.get('/scrape', async (req, res) => {
  const data = await scrape(pageURL);
  const casesToday = data.total;
  const today = data.date;
  console.log('data received from scraper', data);

  // If today's date is equal to the date in the last element of the array, update the total value. If not, push the new total as a new object with today's date
  if (
    initialData[initialData.length - 1].date === today ||
    initialData[initialData.length - 1].total === casesToday
  ) {
    initialData[initialData.length - 1].total === casesToday;
  } else {
    initialData.push({ date: today, total: casesToday });
  }
  const casesYesterday = initialData[initialData.length - 2].total;

  // Get the documents collection
  const collection = db.collection('total-cases-per-day');

  // Update MongoDB if new data with the same date, or create new document if not
  collection.updateOne(
    { date: today },
    { $set: { date: today, total: casesToday } },
    { upsert: true }
  );

  // Checks last document - remove after app is working
  collection
    .find({})
    .sort({ _id: -1 })
    .limit(1)
    .toArray(function(err, doc) {
      assert.equal(err, null);
      console.log('Updated or inserted this document');
      console.log(doc);
    });

  res.send(
    `As of ${new Date()} there are ${
      data.total
    } confirmed cases of coronavirus infection in Quebec (+ ${casesToday -
      casesYesterday} after yesterday).`
  );
});

app.get('/lastdoc', (req, res) => {
  // Get the documents collection
  const collection = db.collection('total-cases-per-day');

  // Get the last document from the collection
  collection
    .find({})
    .sort({ _id: -1 })
    .limit(1)
    .toArray(function(err, doc) {
      assert.equal(err, null);
      console.log('Found this document');
      console.log(doc);
      res.send(JSON.stringify(doc));
    });
});

app.get('/alldata', (req, res) => {
  // Get the documents collection
  const collection = db.collection('total-cases-per-day');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log('Found the following records');
    console.log(docs);
    res.send(JSON.stringify(docs));
  });
});

app.post('/updatedb', async (req, res) => {
  const data = await scrape(pageURL);
  const casesToday = data.total;
  const today = data.date;
  console.log('data received from scraper', data);

  // Get the documents collection
  const collection = db.collection('total-cases-per-day');

  // Update MongoDB if new data with the same date, or create new document if not
  collection.updateOne(
    { date: today },
    { $set: { date: today, total: casesToday } },
    { upsert: true }
  );
});

app.all('/*', (req, res, next) => {
  // needed for react router
  res.sendFile(__dirname + '/build/index.html');
});

app.listen(3000);
