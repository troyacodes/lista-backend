require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const User = require('../../models/User');

const { validateRegisterData } = require('../../util/validators');

module.exports = {
  Mutation: {
    async register(_, { registerInput: { username, email, password, confirmPassword } }, context, info) {
      const { errors, isValid } = validateRegisterData(username, email, password, confirmPassword);

      if (!isValid) {
        throw new UserInputError('Errors', { errors });
      }

      const checkUsername = await User.findOne({ username });
      const checkEmail = await User.findOne({ email });

      if (checkUsername) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'Username is taken'
          }
        });
      } else if (checkEmail) {
        throw new UserInputError('Email is taken', {
          errors: {
            email: 'Email is taken'
          }
        });
      }

      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString()
      });

      const res = await newUser.save();

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
