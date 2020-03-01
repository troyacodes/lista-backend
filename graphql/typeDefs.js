const { gql } = require('apollo-server');

module.exports = gql`
  type Title {
    phrase: String!
    count: Int!
    description: String!
  }

  type Items {
    name: String!
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
    title: Title!
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
    following: [String]
    followers: [String]
    createdAt: String!
  }

  type UserDetails {
    id: ID!
    email: String!
    username: String!
    following: [String]
    followers: [String]
    createdAt: String!
  }

  input SignupInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  input TitleInput {
    phrase: String!
    count: Int!
    description: String!
  }

  input ItemsInput {
    name: String!
    description: String!
  }

  type Query {
    getLists: [List]
    getList(listId: ID!): List!
    getUserLists(username: String!): [List]
    getTagLists(tag: String!): [List]
    getUserDetails: UserDetails!
  }

  type Mutation {
    signup(signupInput: SignupInput): User!
    login(username: String!, password: String!): User!
    createList(title: TitleInput!, tags: [String]!, items: [ItemsInput]!): List!
    deleteList(listId: ID!): String!
    updateItems(listId: ID!, items: [ItemsInput]!): List!
    updateTags(listId: ID!, tags: [String]!): List!
    createComment(listId: ID!, body: String!): List!
    deleteComment(listId: ID!, commentId: ID!): List!
    likeList(listId: ID!): List!
    followUser(userToFollow: String!): User!
  }
`;
