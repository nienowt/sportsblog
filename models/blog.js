'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogSchema = new Schema({

  title: {
    type: String,
    required: true
  },
  authorId: String,
  date: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  keywords: [String],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'comments'
    }
  ],
  titleImage: String,
  primary: String,
  secondary: String
});

module.exports = mongoose.model('Blog', blogSchema);
