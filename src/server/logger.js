var fs = require('fs');
var winston = require('winston');
winston.emitErrs = true;

var logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: './logs/all-logs.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true
    })
  ]
});

// Change logger levels depending on NODE_ENV
if (process.env.NODE_ENV === 'test') {
  logger.transports.console.level = 'error';
  logger.transports.file.level = 'error';
} else if (process.env.NODE_ENV === 'development') {
  logger.transports.console.level = 'verbose';
  logger.transports.file.level = 'verbose';
}

// Log information about logger
logger.info('Logging in %s mode...', process.env.NODE_ENV, {
  meta: {
    NODE_ENV: process.env.NODE_ENV,
    level: {
      console: logger.transports.console.level,
      file: logger.transports.file.level
    }
  }
});

module.exports = logger;
module.exports.stream = {
  write: function (message, encoding) {
    logger.info(message, { type: 'HTTP' });
  }
};
module.exports.streamDev = {
  write: function (message, encoding) {
    logger.info(message.substring(0, message.length - 1), { type: 'HTTP' });
  }
};

module.exports.read = function (callback) {
  fs.readFile('./logs/all-logs.log', 'utf8', function (err, contents) {
    callback(err, (function (file) {
      var entries = file
        .split('\n')
        .filter(function (x) { return x !== ''; })
        .map(function (x) { return JSON.parse(x); })
        .reverse(); 

      return {
        all: function () { return entries; },

        take: function (amount, from) { return this.all()/* TODO */; },

        ofType: function (type) {
          return entries.filter(function (x) { return x.level === type; });
        },

        takeOfType: function (amount, from, type) {
          return this.ofType(type)/* TODO */;
        }
      }
    }(contents)));
  });
};
