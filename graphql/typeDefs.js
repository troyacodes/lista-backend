const { gql } = require('apollo-server');

module.exports = gql`
  type ListItems {
    item: String!
    description: String!
    order: Int!
  }

  type List {
    id: ID!
    count: Int!
    description: String!
    listItems: [ListItems]
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

  input ListItemsInput {
    item: String!
    description: String!
  }

  type Query {
    getLists: [List]
    getList(listId: ID!): List
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createList(count: Int!, description: String!, listItems: [ListItemsInput!]): List!
    deleteList(listId: ID!): String!
    updateListItems(listId: ID!, listItems: [ListItemsInput!]): List!
  }
`;
