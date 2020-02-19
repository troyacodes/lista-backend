const listResolvers = require('./lists');
const userResolver = require('./users');

module.exports = {
  Query: {
    ...listResolvers.Query
  }
};
