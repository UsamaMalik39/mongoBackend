const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(require('./config').mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Load routes
require('../src/apis/users/users.routes')(app);
require('../src/jobs/jobs.routes')(app);

module.exports = app;
