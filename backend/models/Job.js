const mongoose = require('mongoose');
const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: String,
  location: String,
  description: String,
  postedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Job', JobSchema);