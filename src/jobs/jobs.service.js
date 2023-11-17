const redis = require('../redis');
const { v4: uuidv4 } = require('uuid');

const JOB_QUEUE_NAME = 'jobQueue';
const JOB_RESULT_PREFIX = 'jobResult:';

const enqueueJob = async (jobData) => {
  const jobId = uuidv4();
  const job = { id: jobId, data: jobData, status: 'queued' };

  await redis.lpush(JOB_QUEUE_NAME, JSON.stringify(job));

  return jobId;
};

const processJob = async () => {
  const jobString = await redis.rpop(JOB_QUEUE_NAME);

  if (jobString) {
    const job = JSON.parse(jobString);
    job.status = 'processing';

    // Simulate job processing - Replace this with your actual job processing logic
    await new Promise((resolve) => setTimeout(resolve, 5000));

    job.status = 'completed';
    job.result = `Job ${job.id} completed successfully`;

    await redis.set(`${JOB_RESULT_PREFIX}${job.id}`, JSON.stringify(job.result));

    return job;
  }

  return null;
};

const getJobStatus = async (jobId) => {
  const jobResultString = await redis.get(`${JOB_RESULT_PREFIX}${jobId}`);
  if (jobResultString) {
    return { status: 'completed', result: JSON.parse(jobResultString) };
  }

  const jobQueueIndex = await redis.lindex(JOB_QUEUE_NAME, -1);
  if (jobQueueIndex) {
    const lastJob = JSON.parse(jobQueueIndex);
    if (lastJob.id === jobId && lastJob.status === 'queued') {
      return { status: 'queued' };
    }
  }

  return { status: 'not found' };
};

module.exports = {
  createJob: enqueueJob,
  processJob,
  getJobStatus,
};
