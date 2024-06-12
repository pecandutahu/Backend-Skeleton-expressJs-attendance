const moment = require('moment-timezone');

// Middleware to set timezone to GMT +7
const setTimezone = (req, res, next) => {
  req.currentTime = () => moment().tz('Asia/Jakarta'); // GMT +7
  next();
};

module.exports = setTimezone;
