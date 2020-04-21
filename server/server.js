// Import and initiate libraries
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

// Import internal data and components
const data = require('../src/data');
// Destructuring data from internal component
const { mongoURI } = data; // This is the MongoDB connection URI

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
app.use(express.static('client/public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile('index.html');
});

app.get('/alldata', async (req, res) => {
  // Get the documents collection
  const totalCasesPerDay = db.collection('totalCasesPerDay');
  const casesByRegion = db.collection('casesByRegion');
  const casesByAgeGroup = db.collection('casesByAgeGroup');
  const deathsByAge = db.collection('deathsByAge');
  const deathsByRegion = db.collection('deathsByRegion');
  const hospitalization = db.collection('hospitalization');
  const testsData = db.collection('tests');
  const totalDeaths = db.collection('totalDeaths');
  const canadaData = db.collection('canadaData');

  // Find some documents
  const totalCases = await totalCasesPerDay
    .find({})
    .sort({ total: 1 })
    .project({ _id: 0 })
    .toArray();
  const regionCases = await casesByRegion
    .find({})
    .sort({ _id: -1 })
    .project({ _id: 0 })
    .limit(1)
    .toArray();
  const ageGroupCases = await casesByAgeGroup
    .find({})
    .sort({ _id: -1 })
    .project({ _id: 0 })
    .limit(1)
    .toArray();
  const deathsByAgeGroup = await deathsByAge
    .find({})
    .sort({ _id: -1 })
    .project({ _id: 0 })
    .limit(1)
    .toArray();
  const regionDeaths = await deathsByRegion
    .find({})
    .sort({ _id: -1 })
    .project({ _id: 0 })
    .limit(1)
    .toArray();
  const hospitalizations = await hospitalization
    .find({})
    .sort({ _id: -1 })
    .project({ _id: 0 })
    .limit(1)
    .toArray();
  const tests = await testsData
    .find({})
    .sort({ _id: -1 })
    .project({ _id: 0 })
    .limit(1)
    .toArray();
  const deaths = await totalDeaths
    .find({})
    .sort({ _id: -1 })
    .project({ _id: 0 })
    .limit(1)
    .toArray();
  const caData = await canadaData
    .find({})
    .sort({ _id: -1 })
    .project({ _id: 0 })
    .limit(1)
    .toArray();

  res.json({
    totalCases,
    regionCases,
    ageGroupCases,
    deathsByAgeGroup,
    regionDeaths,
    hospitalizations,
    tests,
    deaths,
    caData,
  });
});

app.listen(process.env.PORT || 3000);
