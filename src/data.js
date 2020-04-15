require('dotenv').config();

const pageURL =
  'https://www.quebec.ca/en/health/health-issues/a-z/2019-coronavirus/situation-coronavirus-in-quebec/';

const canadaURL =
  'https://www.canada.ca/en/public-health/services/diseases/coronavirus-disease-covid-19.html';

const mongoURI = process.env.MONGOURI;

module.exports = {
  pageURL,
  canadaURL,
  mongoURI,
};
