const { AuthenticationError, UserInputError } = require('apollo-server');

const List = require('../../models/List');
const User = require('../../models/User');
const authCheck = require('../../util/authCheck');

module.exports = {
  Query: {
    getLists: async () => {
      try {
        const lists = await List.find().sort({ createdAt: -1 });
        return lists;
      } catch (err) {
        throw new Error(err);
      }
    },
    getUserLists: async (_, { username }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new UserInputError('User not found');
      }
      try {
        const lists = await List.find({ username: username }).sort({ createdAt: -1 });
        if (lists) {
          return {
            user,
            lists
          };
        }
      } catch (err) {
        throw new Error('List not found', err);
      }
    },
    getList: async (_, { listId }) => {
      try {
        const list = await List.findById(listId);
        if (list) {
          return list;
        }
      } catch (err) {
        throw new Error('List not found', err);
      }
    },
    getTagLists: async (_, { tag }) => {
      try {
        const lists = await List.find({ tags: tag }).sort({ createdAt: -1 });
        if (lists) {
          return lists;
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    getTimeline: async (_, { following }) => {
      try {
        const lists = await List.find({ username: { $in: following } }).sort({
          createdAt: -1
        });
        if (lists) {
          return lists;
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },

  Mutation: {
    createList: async (_, { title, tags, items }, context) => {
      const user = authCheck(context);
      const errors = {};

      items.forEach(item => {
        if (item.name === '') {
          errors.listError = 'Item name can not be empty';
          throw new UserInputError('Item name can not be empty', { errors });
        }
      });

      const newList = new List({
        title,
        items: items.map((item, index) => ({ ...item, order: index + 1 })),
        tags: tags.map(tag => tag.toLowerCase().trim()),
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      });

      const list = await newList.save();

      return list;
    },
    deleteList: async (_, { listId }, context) => {
      const user = authCheck(context);
      try {
        const list = await List.findById(listId);
        if (user.username === list.username) {
          await list.delete();
          return 'List successfully deleted';
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    updateItems: async (_, { listId, items }, context) => {
      const user = authCheck(context);

      try {
        const list = await List.findById(listId);
        if (user.username === list.username) {
          list.items = items.map((list, index) => ({ ...list, order: index + 1 }));
          await list.save();
          return list;
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    updateTags: async (_, { listId, tags }, context) => {
      const user = authCheck(context);
      const list = await List.findById(listId);
      try {
        if (user.username === list.username) {
          list.tags = tags;
          await list.save();
          return list;
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    likeList: async (_, { listId }, context) => {
      const { username } = authCheck(context);
      const list = await List.findById(listId);

      if (list) {
        if (list.likes.find(like => like.username === username)) {
          list.likes = list.likes.filter(like => like.username !== username);
        } else {
          list.likes.push({
            username,
            createdAt: new Date().toISOString()
          });
        }
        await list.save();
        return list;
      } else {
        throw new UserInputError('List not found');
      }
    }
  }
};
