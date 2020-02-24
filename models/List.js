const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
  username: String,
  title: {
    phrase: String,
    count: Number,
    description: String
  },
  tags: [String],
  items: [
    {
      name: String,
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
