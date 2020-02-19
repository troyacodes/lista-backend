const { AuthenticationError } = require('apollo-server');

const List = require('../../models/List');
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
    getList: async (_, { listId }) => {
      try {
        const list = await List.findById(listId);
        if (list) {
          return list;
        }
      } catch (err) {
        throw new Error('List not found', err);
      }
    }
  },
  Mutation: {
    createList: async (_, { count, description, listItems }, context) => {
      const user = authCheck(context);

      const newList = new List({
        count,
        description,
        listItems: listItems.map((list, index) => ({ ...list, order: index + 1 })),
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
    updateListItems: async (_, { listId, listItems }, context) => {
      const user = authCheck(context);
      try {
        const list = await List.findById(listId);
        if (user.username === list.username) {
          list.listItems = listItems.map((list, index) => ({ ...list, order: index + 1 }));
          console.log(list);
          await list.save();
          return list;
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  }
};
