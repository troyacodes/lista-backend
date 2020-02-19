require('dotenv').config();

const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');

const List = require('./models/List');

const typeDefs = gql`
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

const resolvers = {
  Query: {
    getLists: async () => {
      try {
        const lists = await List.find();
        return lists;
      } catch (err) {
        throw new Error(err);
      }
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

mongoose
  .connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

server.listen({ port: 5000 }).then(res => {
  console.log(`Server running at ${res.url}`);
});
