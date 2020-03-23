//Import and initiate libraries
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//Import internal data and components
const scrape = require('./src/scraper');
const data = require('./src/data');
const initialData = require('./src/initialData.json');
//Destructuring data from internal component
const { pageURL } = data;
const { mongoURI } = data;
//Import MongoDB Schema
const Cases = require('./src/models/Cases');

console.log(pageURL);
console.log(mongoURI);

//Connect to MongoDB
// mongoose
//   .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDb connected'))
//   .catch(e => console.log(e));

const MongoClient = require('mongodb').MongoClient;
const uri = mongoURI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect(err => {
  const collection = client
    .db('qc-coronavirus-cases')
    .collection('total-cases-per-day');
  // perform actions on the collection object
  client.close();
});

//Initiate body parser
app.use(bodyParser.json());

//Routes
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

app.listen(3000);
