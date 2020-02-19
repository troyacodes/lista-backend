const { gql } = require('apollo-server');

module.exports = gql`
  type List {
    id: ID!
    count: Int!
    description: String!
    createdAt: String!
    username: String!
  }

  type Query {
    getLists: [List]
  }
`;
