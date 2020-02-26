require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const User = require('../../models/User');

const { validateSignupData, validateLoginData } = require('../../util/validators');

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
  Mutation: {
    signup: async (_, { signupInput: { username, email, password, confirmPassword } }, context, info) => {
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
      const { errors, isValid } = validateLoginData(username, password);
      if (!isValid) {
        throw new UserInputError('Errors', { errors });
      }

      const user = await User.findOne({ username });

      if (!user) {
        errors.general = 'Invalid email or password';
        throw new UserInputError('Invalid email or password', { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = 'Invalid email or password';
        throw new UserInputError('Invalid email or password', { errors });
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
