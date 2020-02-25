const isEmpty = require('is-empty');
const validator = require('validator');

exports.validateSignupData = (username, email, password, confirmPassword) => {
  const errors = {};
  const regex = /^[A-Za-z0-9 ]+$/;
  const usernameTest = regex.test(username);

  if (isEmpty(email)) {
    errors.email = 'Email can not be empty';
  } else if (!validator.isEmail(email)) {
    errors.email = 'Must be a valid email';
  }

  if (isEmpty(password)) {
    errors.password = 'Password can not be empty';
  } else if (password.length < 6) {
    errors.password = 'Password must be a minimum of 6 characters';
  }

  if (password !== confirmPassword) {
    errors.password = 'Passwords must match';
  }

  if (isEmpty(username)) {
    errors.username = 'Username can not be empty';
  } else if (username.length < 4) {
    errors.username = 'Username must be a minimum of 4 characters';
  } else if (!usernameTest) {
    errors.username = 'Username can only have letters and numbers';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

exports.validateLoginData = (username, password) => {
  const errors = {};
  if (isEmpty(username)) {
    errors.email = 'Email can not be empty';
  }
  if (isEmpty(password)) {
    errors.password = 'Password can not be empty';
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
