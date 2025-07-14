const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  referrer: {
    type: String,
    default: 'Direct',
  },
  geoLocation: {
    type: String,
    default: 'Unknown',
  },
}, { _id: false });

const urlSchema = new mongoose.Schema({
  originalURL: {
    type: String,
    required: true,
  },
  shortcode: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  clicks: [clickSchema],
}, {
  timestamps: true,
  versionKey: false,
});

const Url = mongoose.model('Url', urlSchema);
module.exports = Url;
