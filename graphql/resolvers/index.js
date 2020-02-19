const listResolvers = require('./lists');
const usersResolver = require('./users');
const commentsResolvers = require('./comments');

module.exports = {
  List: {
    likeCount: parent => {
      return parent.likes.length;
    },
    commentCount: parent => {
      return parent.comments.length;
    }
  },
  Query: {
    ...listResolvers.Query
  },
  Mutation: {
    ...usersResolver.Mutation,
    ...listResolvers.Mutation,
    ...commentsResolvers.Mutation
  }
};
