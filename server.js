require('dotenv').config();

const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');

const typeDefs = gql`
  type Query {
    sayHi: String!
  }
`;

const resolvers = {
  Query: {
    sayHi: () => 'Hello World'
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
