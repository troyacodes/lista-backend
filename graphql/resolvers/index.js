const listResolvers = require('./lists');
const usersResolver = require('./users');

module.exports = {
  Query: {
    ...listResolvers.Query
  },
  Mutation: {
    ...usersResolver.Mutation
  }
};
