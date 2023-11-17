const jobService = require('./jobs.service');
const cache = require('node-cache');
const logger = require('../logger');

const jobCache = new cache({ stdTTL: 10 });

module.exports = {
  createJob: async (req, res) => {
    try {
      const jobId = await jobService.createJob(req.body);
      res.status(201).json({ jobId });
    } catch (error) {
      logger.error(`Error creating job: ${error.message}`);
      res.status(400).json({ error: 'Bad Request' });
    }
  },

  getJobStatus: async (req, res) => {
    try {
      const jobId = req.params.id;

      // Check if the job status is cached
      const cachedJobStatus = jobCache.get(jobId);
      if (cachedJobStatus) {
        return res.status(200).json(cachedJobStatus);
      }

      // If not cached, fetch the job status from the service
      const jobStatus = await jobService.getJobStatus(jobId);

      // Cache the job status for subsequent requests
      jobCache.set(jobId, jobStatus);

      res.status(200).json(jobStatus);
    } catch (error) {
      logger.error(`Error getting job status: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
