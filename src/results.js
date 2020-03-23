const data = require('./data');
const { mongoURI } = data;
const mongoose = require('mongoose');

mongoose
  .connect(mongoURI, { useNewUrlParser: true })
  .then(() => console.log('MongoDb connected'))
  .catch(e => console.log(e));

const compareAndSave = dataObj => {
  try {
    mongoose.disconnect();
  } catch (e) {
    console.log(e);
  }
};

module.exports = compareAndSave;
