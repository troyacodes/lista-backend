require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');

module.exports = {
  Mutation: {
    async register(_, { registerInput: { username, email, password, confirmPassword } }, context, info) {
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString()
      });

      const res = await newUser.save();

      console.log(res);

      const token = jwt.sign(
        {
          id: res.id,
          email: res.email,
          username: res.username
        },
        process.env.SECRET_KEY,
        {
          expiresIn: '1h'
        }
      );

      return {
        ...res._doc,
        id: res._id,
        token
      };
    }
  }
};
