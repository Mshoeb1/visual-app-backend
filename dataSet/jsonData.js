const mongoose = require("mongoose");

const vData = mongoose.Schema({
  end_year: String,
  intensity: String,
  sector: String,
  topic: String,
  insight: String,
  url: String,
  region: String,
  start_year: String,
  impact: String,
  added: String,
  published: String,
  country: String,
  relevance: String,
  pestle: String,
  source: String,
  title: String,
  likelihood: String,
});

const Data = mongoose.model("visualData", vData);
module.exports = Data;
