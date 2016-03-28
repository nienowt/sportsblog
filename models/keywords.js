'use strict';

 let mongoose = require('mongoose');

let keywordSchema = mongoose.Schema({
  keyword: {type: String, unique: true},
  articles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'articles'
    }
  ]
})

module.exports = mongoose.model('keywords', keywordSchema);
