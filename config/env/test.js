module.exports = {
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'dev',
    options: {
      // Stream defaults to process.stdout
      // Uncomment/comment to toggle the logging to a log on the file system
      stream: {
        directoryPath: process.cwd(),
        fileName: 'logs/access.log',
        rotatingLogs: { // for more info on rotating logs - https://github.com/holidayextras/file-stream-rotator#usage
          active: false, // activate to use rotating logs
          fileName: 'access-%DATE%.log', // if rotating logs are active, this fileName setting will be used
          frequency: 'daily',
          verbose: false,
        },
      },
    },
  },
  mailer: {
    from: process.env.MAILER_FROM || 'MAILER_FROM',
    options: {
      host: process.env.MAILER_HOST || 'smtp.gmail.com',
      port: process.env.MAILER_PORT || 465,
      secure: process.env.MAILER_SECURE !== 'false',
      auth: {
        user: process.env.MAILER_AUTH_USER || 'MAILER_AUTH_USER',
        pass: process.env.MAILER_AUTH_PASS || '',
      },
    },
  },
};
