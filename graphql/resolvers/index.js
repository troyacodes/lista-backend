const listResolvers = require('./lists');
const usersResolver = require('./users');
const commentsResolvers = require('./comments');
const tagResolvers = require('./tags');
const followResolvers = require('./follow');

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
    ...usersResolver.Query,
    ...listResolvers.Query,
    ...tagResolvers.Query
  },
  Mutation: {
    ...usersResolver.Mutation,
    ...listResolvers.Mutation,
    ...commentsResolvers.Mutation,
    ...tagResolvers.Mutation,
    ...followResolvers.Mutation
  }
};
