require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const User = require('../../models/User');

const { validateSignupData, validateLoginData } = require('../../util/validators');
const authCheck = require('../../util/authCheck');

const generateJWT = user => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username
    },
    process.env.SECRET_KEY,
    {
      expiresIn: '1h'
    }
  );
};

module.exports = {
  Query: {
    getUserDetails: async (_, vars, context) => {
      try {
        const currentUser = authCheck(context);
        const user = await User.findOne({ username: currentUser.username });
        if (!user) {
          throw new UserInputError('User not found');
        }
        return user;
      } catch (err) {
        throw new Error('User not found', err);
      }
    }
  },
  Mutation: {
    signup: async (_, { signupInput: { username, email, password, confirmPassword } }) => {
      username = username.trim();
      password = password.trim();

      const { errors, isValid } = validateSignupData(username, email, password, confirmPassword);

      if (!isValid) {
        throw new UserInputError('Errors', { errors });
      }

      const checkUsername = await User.findOne({ username });
      const checkEmail = await User.findOne({ email });

      if (checkUsername) {
        throw new UserInputError('Username already in use', {
          errors: {
            username: 'Username already in use'
          }
        });
      } else if (checkEmail) {
        throw new UserInputError('Email already in use', {
          errors: {
            email: 'Email already in use'
          }
        });
      }

      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        username,
        password,
        following: [],
        followers: [],
        createdAt: new Date().toISOString()
      });

      const user = await newUser.save();

      const token = generateJWT(user);

      return {
        ...user._doc,
        id: user._id,
        token
      };
    },

    login: async (_, { username, password }) => {
      username = username.trim();

      const { errors, isValid } = validateLoginData(username, password);
      if (!isValid) {
        throw new UserInputError('Errors', { errors });
      }

      const user = await User.findOne({ username });

      if (!user) {
        errors.general = 'Invalid username or password';
        throw new UserInputError('Invalid username or password', { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = 'Invalid username or password';
        throw new UserInputError('Invalid username or password', { errors });
      }

      const token = generateJWT(user);

      return {
        ...user._doc,
        id: user._id,
        token
      };
    }
  }
};
