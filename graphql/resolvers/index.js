const listResolvers = require('./lists');
const usersResolver = require('./users');
const commentsResolvers = require('./comments');

module.exports = {
  Query: {
    ...listResolvers.Query
  },
  Mutation: {
    ...usersResolver.Mutation,
    ...listResolvers.Mutation,
    ...commentsResolvers.Mutation
  }
};
