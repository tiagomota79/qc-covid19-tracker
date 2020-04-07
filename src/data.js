require('dotenv').config();

const qcPageURL =
  'https://www.quebec.ca/sante/problemes-de-sante/a-z/coronavirus-2019/situation-coronavirus-quebec/';

const caPageURL =
  'https://www.canada.ca/en/public-health/services/diseases/coronavirus-disease-covid-19.html';

const mongoURI = process.env.MONGOURI;

module.exports = {
  qcPageURL,
  caPageURL,
  mongoURI,
};
