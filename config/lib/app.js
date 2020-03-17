/* eslint-disable no-console */

/**
 * Module dependencies.
 */
const chalk = require('chalk');
const debug = require('debug')('app:config:lib:app');

const config = require('..');
const express = require('./express');

module.exports.start = async function start(callback) {
  // Initialize express
  const app = await express.init();

  // Start the app by listening on <port>
  const server = app.listen(config.port, config.host, () => {
    const { port, address } = server.address();
    // Logging initialization
    debug('--');
    const addr = `http${config.secure && config.secure.ssl ? 's' : ''}://${address}:${port}`;
    debug(chalk.green(`Address:\t\t\t${addr}`));
    if (config.secure.ssl) {
      debug(chalk.green('HTTPs:\t\t\t\ton'));
    }
    debug(chalk.green(`Environment:\t\t${process.env.NODE_ENV}`));
    debug(chalk.green(`App version:\t\t${config.pkg.version}`));
    debug(chalk.green(`Public address:\t\t${config.app.publicAddress}`));
    debug('--');

    if (callback) callback(app, config);
  });
};
