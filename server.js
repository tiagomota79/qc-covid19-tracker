// Import and initiate libraries
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Import internal data and components
const scrape = require('./src/scraper');
const data = require('./src/data');
const initialData = require('./src/initialData.json');
// Destructuring data from internal component
const { pageURL } = data;
const { mongoURI } = data;
// Import MongoDB Schema
const Cases = require('./src/models/Cases');

console.log(pageURL);
console.log(mongoURI);

// Connect to MongoDB with Mongoose
// mongoose
//   .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDb connected'))
//   .catch(e => console.log(e));

// Connect to MongoDB
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = mongoURI;

// Database Name
const dbName = 'qc-coronavirus-cases';

// Create a new MongoClient
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Use connect method to connect to the Server
// client.connect(function(err) {
//   assert.equal(null, err);
//   console.log('Connected successfully to MongoDB server');

//   const db = client.db(dbName);

//   findDocuments(db, function() {
//     client.close();
//   });
// });

// MongoDB find all documents function
const findDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('total-cases-per-day');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    const mongodata = docs;
    console.log('Found the following records');
    console.log(mongodata);
    callback(docs);
    return mongodata;
  });
};

// Initiate body parser
app.use(bodyParser.json());

// Routes
app.get('/', async (req, res) => {
  const data = await scrape(pageURL);
  const casesToday = data.total;
  const today = data.date;
  console.log('data received from scraper', data);
  if (initialData[initialData.length - 1].date === today) {
    initialData[initialData.length - 1].total === casesToday;
  } else {
    initialData.push({ date: today, total: casesToday });
  }
  const casesYesterday = initialData[initialData.length - 2].total;
  res.send(
    `As of ${new Date()} there are ${
      data.total
    } confirmed cases of coronavirus infection in Quebec (+ ${casesToday -
      casesYesterday} after yesterday).`
  );
});

app.get('/history', (req, res) => {
  // const history = await Cases.find({});
  // console.log('Historical cases', history);
  // res.json(history);
  res.json(initialData);
});

app.get('/mongo', (req, res) => {
  const data = client.connect(function(err) {
    assert.equal(null, err);
    console.log(
      'Connected successfully to MongoDB server on the /mongo endpoint'
    );

    const db = client.db(dbName);

    findDocuments(db, function() {
      client.close();
    });
  });
  console.log(data);
  res.send(`reading document inside MongoDB`);
});

app.listen(3000);
