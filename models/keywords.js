'use strict';

 let mongoose = require('mongoose');

let keywordSchema = mongoose.Schema({
  keyword: String,
  articles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'articles'
    }
  ]
})

module.exports = mongoose.model('keywords', keywordSchema);
