const User = require('../../models/user.model');
const mongoose = require('mongoose');
const client = require('../../redis');

module.exports = {
  getAllUsers: async (query) => {
    try {
      await client.connect()
      const cacheKey = `getAllUsers:${JSON.stringify(query)}`;
      const cachedData = await client.get(cacheKey);

      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const { page = 0, limit = 10, sortBy = 'createdAt', sortOrder = 'asc' } = query;
      const users = await User.find({ isDeleted: false })
        .skip(page * limit)
        .limit(limit)
        .sort({ [sortBy]: sortOrder == 'desc' ? -1 : 1 });

      await client.setEx(cacheKey, 3600, JSON.stringify(users));

      return users;
    } catch (error) {
      console.error(`Error in getAllUsers: ${error.message}`);
      throw error;
    }finally {
      client.quit();
    }
  },

  getUserById: async (userId) => {
    try {
      await client.connect()
      const cacheKey = `getUserById:${userId}`;
      const cachedData = await client.get(cacheKey);

      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const user = await User.findById(userId);

      if (!user) {
        return null;
      }

      await client.setex(cacheKey, 3600, JSON.stringify(user));

      return user;
    } catch (error) {
      console.error(`Error in getUserById: ${error.message}`);
      throw error;
    }finally {
      client.quit();
    }
  },

  createUser: async (userData) => {
    try {
      userData._id = new mongoose.Types.ObjectId();
      const newUser = await User.create(userData);
      await clearCache('getAllUsers:*');
      return newUser;
    } catch (error) {
      console.error(`Error in createUser: ${error.message}`);
      throw error;
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, userData, { new: true });

      if (!updatedUser) {
        return null;
      }

      await clearCache(`getUserById:${userId}`);
      await clearCache('getAllUsers:*');

      return updatedUser;
    } catch (error) {
      console.error(`Error in updateUser: ${error.message}`);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      await clearCache(`getUserById:${userId}`);
      await clearCache('getAllUsers:*');

      const deletedUser = await User.updateOne({ _id: userId }, { isDeleted: true });
      return deletedUser;
    } catch (error) {
      console.error(`Error in deleteUser: ${error.message}`);
      throw error;
    }
  },
};

async function clearCache(pattern) {
  try{
    await client.connect()

    const keys = await client.keys(pattern);
  
    if (keys.length > 0) {
      await client.del(keys);
    }
  } catch(err){
    console.error(`Error in clearCache: ${error.message}`);
    throw error;
  } finally {
    client.quit();
  }

  
}
