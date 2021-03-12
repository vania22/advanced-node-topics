require('../models/User');

const keys = require('../config/keys');
const mongoose = require('mongoose');

mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
