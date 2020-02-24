const { AuthenticationError } = require('apollo-server');

const List = require('../../models/List');
const authCheck = require('../../util/authCheck');

module.exports = {
  Mutation: {
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
    }
  }
};
