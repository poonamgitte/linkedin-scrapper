const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  name: String,
  url: String,
  about: String,
  bio: String,
  location: String,
  followerCount: Number,
  connectionCount: Number,
});

module.exports = mongoose.model('Profile', ProfileSchema);