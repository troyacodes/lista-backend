const { UserInputError } = require('apollo-server');

const User = require('../../models/User');
const authCheck = require('../../util/authCheck');

module.exports = {
  Mutation: {
    followUser: async (_, { userToFollow }, context) => {
      const { username } = authCheck(context);

      const follower = await User.findOne({ username });
      const toFollow = await User.findOne({ username: userToFollow });

      if (follower && toFollow) {
        if (follower.following.find(users => users === toFollow.username)) {
          follower.following = follower.following.filter(users => users !== toFollow.username);
          toFollow.followers = toFollow.followers.filter(users => users !== follower.username);
        } else {
          follower.following.push(toFollow.username);
          toFollow.followers.push(follower.username);
        }
        await follower.save();
        await toFollow.save();
        return follower;
      } else {
        throw new UserInputError('User not found');
      }
    }
  }
};
