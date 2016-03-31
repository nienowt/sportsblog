'use strict';

let mongoose = require('mongoose');

let keywordSchema = mongoose.Schema({
  keyword: {
    type: String,
    unique: true
  },
  articles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
  followedBy : [
    {
      type: mongoose.Schema.Types.ObjectId,
      unique: true,
      ref: 'User'
    }
  ]
});

module.exports = mongoose.model('keywords', keywordSchema);
