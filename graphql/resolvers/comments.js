const { UserInputError, AuthenticationError } = require('apollo-server');

const List = require('../../models/List');
const authCheck = require('../../util/authCheck');

module.exports = {
  Mutation: {
    createComment: async (_, { listId, body }, context) => {
      const { username } = authCheck(context);
      if (body.trim() === '') {
        throw new UserInputError('Empty comment', {
          errors: {
            body: 'Comment can not be empty'
          }
        });
      }

      const list = await List.findById(listId);
      if (list) {
        list.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString()
        });

        await list.save();
        return list;
      } else {
        throw new UserInputError('List not found');
      }
    },
    deleteComment: async (_, { listId, commentId }, context) => {
      const { username } = authCheck(context);
      const list = await List.findById(listId);

      if (list) {
        const commentIndex = list.comments.findIndex(comm => comm.id === commentId);

        if (list.comments[commentIndex].username === username) {
          list.comments.splice(commentIndex, 1);
          await list.save();
          return list;
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } else {
        throw new UserInputError('List not found');
      }
    }
  }
};
