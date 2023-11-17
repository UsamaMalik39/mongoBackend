const User = require('../../models/user.model');
const mongoose = require('mongoose');

module.exports = {
  
  getAllUsers: async (query) => {
    const { page = 0, limit = 10, sortBy = 'createdAt', sortOrder = 'asc' } = query;


    const users = await User.find({isDeleted : false}).skip(page*limit).limit(limit).sort({[sortBy] :  sortOrder == 'desc' ? 1 :-1});
    return users;
  },

  getUserById: async (userId) => {
    const user = await User.findById(userId);
    return user;
  },

  createUser: async (userData) => {
    userData._id = new mongoose.Types.ObjectId();
    const newUser = await User.create(userData);
    return newUser;
  },

  updateUser: async (userId, userData) => {
    const updatedUser = await User.findByIdAndUpdate(userId, userData, { new: true });
    return updatedUser;
  },

  deleteUser: async (userId) => {
    const deletedUser = await User.updateOne({_id : userId} , {isDeleted : true});
    return deletedUser;
  },
};
