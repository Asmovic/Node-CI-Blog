jest.setTimeout(80000);
const mongoose = require('mongoose');
require('../models/User');
const keys = require('../config/keys');

mongoose.Promise = global.Promise;

mongoose.connect(keys.mongoURI, { useMongoClient: true });
