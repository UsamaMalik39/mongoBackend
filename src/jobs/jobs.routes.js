const express = require('express');
const router = express.Router();
const jobController = require('./jobs.controller');

router.post('/jobs', jobController.createJob);
router.get('/jobs/:id', jobController.getJobStatus);

module.exports = (app) => {
  app.use('/api', router);
};
