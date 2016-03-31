'use strict';

let mongoose = require('mongoose');

let subscriberSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true}
});

module.exports = mongoose.model('Subscriber', subscriberSchema);
