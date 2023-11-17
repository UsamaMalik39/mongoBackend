const userService = require('./users.service');
const logger = require('../../logger');

module.exports = {
  getAllUsers: async (req, res) => {
    try {
      const users = await userService.getAllUsers(req.query);
      res.status(200).json(users);
    } catch (error) {
      logger.error(`Error getting users: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      logger.error(`Error getting user by ID: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  createUser: async (req, res) => {
    try {
      const newUser = await userService.createUser(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      logger.error(`Error creating user: ${error.message}`);
      res.status(400).json({ error: 'Bad Request' });
    }
  },

  updateUser: async (req, res) => {
    try {
      const updatedUser = await userService.updateUser(req.params.id, req.body);
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      logger.error(`Error updating user: ${error.message}`);
      res.status(400).json({ error: 'Bad Request' });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const deletedUser = await userService.deleteUser(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(204).send();
    } catch (error) {
      logger.error(`Error deleting user: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
