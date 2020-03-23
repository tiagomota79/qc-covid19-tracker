require('dotenv').config();

const pageURL =
  'https://www.quebec.ca/sante/problemes-de-sante/a-z/coronavirus-2019/situation-coronavirus-quebec/';

const mongoURI = process.env.MONGOURI;

module.exports = {
  pageURL,
  mongoURI,
};
