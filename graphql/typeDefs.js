const { gql } = require('apollo-server');

module.exports = gql`
  type Items {
    item: String!
    description: String!
    order: Int!
  }

  type Comment {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
  }

  type Like {
    id: ID!
    username: String!
    createdAt: String!
  }

  type List {
    id: ID!
    count: Int!
    description: String!
    tags: [String]!
    items: [Items]!
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
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

  input ItemsInput {
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
    createList(count: Int!, description: String!, tags: [String]!, items: [ItemsInput]!): List!
    deleteList(listId: ID!): String!
    updateItems(listId: ID!, items: [ItemsInput]!): List!
    updateTags(listId: ID!, tags: [String]!): List!
    createComment(listId: ID!, body: String!): List!
    deleteComment(listId: ID!, commentId: ID!): List!
    likeList(listId: ID!): List!
  }
`;
