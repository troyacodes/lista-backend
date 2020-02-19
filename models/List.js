const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
  username: String,
  count: Number,
  description: String,
  listItems: [
    {
      item: String,
      description: String,
      order: Number
    }
  ],
  comments: [
    {
      body: String,
      username: String,
      createdAt: String
    }
  ],
  likes: [
    {
      username: String,
      createdAt: String
    }
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  createdAt: String
});

const List = mongoose.model('List', ListSchema);

module.exports = List;
