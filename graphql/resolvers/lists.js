const List = require('../../models/List');

module.exports = {
  Query: {
    getLists: async () => {
      try {
        const lists = await List.find();
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
  }
};
