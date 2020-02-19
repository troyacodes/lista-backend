require('dotenv').config();
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server');

module.exports = context => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split('Bearer ')[1];
    if (token) {
      try {
        const user = jwt.verify(token, process.env.SECRET_KEY);
        return user;
      } catch (err) {
        throw new AuthenticationError('Invalid token');
      }
    }
    throw new Error('Invalid authentication token');
  }
  throw new Error('Invalid authentication header');
};
