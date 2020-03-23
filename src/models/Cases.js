const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CasesSchema = new Schema({
  date: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('total-cases-per-day', CasesSchema);
