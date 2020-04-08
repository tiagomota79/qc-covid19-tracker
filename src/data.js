require('dotenv').config();

const pageURL =
  'https://www.quebec.ca/en/health/health-issues/a-z/2019-coronavirus/situation-coronavirus-in-quebec/';

const mongoURI = process.env.MONGOURI;

module.exports = {
  pageURL,
  mongoURI,
};
