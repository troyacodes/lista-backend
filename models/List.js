const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
  username: String,
  title: String,
  items: Array,
  date: {
    type: Date,
    default: Date.now
  }
});

const List = mongoose.model('List', ListSchema);

module.exports = List;
