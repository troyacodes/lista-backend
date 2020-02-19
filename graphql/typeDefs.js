const { gql } = require('apollo-server');

module.exports = gql`
  type List {
    id: ID!
    count: Int!
    description: String!
    createdAt: String!
    username: String!
  }

  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }

  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  type Query {
    getLists: [List]
    getList(listId: ID!): List
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createList(count: Int!, description: String!): List!
    deleteList(listId: ID!): String!
  }
`;
