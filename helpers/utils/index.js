// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
const Ajv = require('ajv');
const { resolve } = require('path');
const { readFile } = require('fs');
const { promisify } = require('util');
const ajvErrors = require('ajv-errors');
// eslint-disable-next-line import/no-dynamic-require
const sockets = require(resolve('config/lib/socket.io'));

let excludeCache;
const readFile$ = promisify(readFile);
const ajv = new Ajv({ allErrors: true, jsonPointers: true });
ajvErrors(ajv);

/**
 * Validates a payload with a given schema
 * @param {Object} schema The schema of the payload
 */
exports.validate = (schema) => async function validateSchema(req, res, next) {
  const validate = ajv.compile(schema);

  if (validate(req.body)) {
    return next();
  }

  return res.status(400).json({
    error: true,
    message: validate.errors,
  });
};

/**
 * Check current user has IAM
 * @param {Object} iam the IAM to check
 */
exports.hasIAM = (iam) => async function hasIAM(req, res, next) {
  const { iams } = req;

  // Check if the user has the permission.
  if (iams.find((el) => el.iam === iam) === undefined) {
    return res.status(403).json({ message: `You don't have permission ${iam} to continue` });
  }

  return next();
};

/**
 * Gets the base URL of the request
 * @param {IncomingMessage} req The request
 */
exports.getBaseURLFromRequest = (req) => {
  const protocol = req.get('x-forwarded-proto') || req.protocol;
  return `${protocol}://${req.get('host')}`;
};

/**
 * Check an IAM if it is exluded or not
 * @param {Object} iam The IAM object
 */
exports.isExcluded = async ({ iam, parents = [] }) => {
  if (process.env.NODE_ENV === 'test') {
    return {
      found: false,
    };
  }
  if (!excludeCache) {
    let content = '';
    try {
      content = await readFile$(resolve('.api.exclude'), { encoding: 'utf8' });
    } catch (e) {
      // Ignore, just proceed
    }

    excludeCache = content.split('\n')
      .map((one) => one.trim())
      .filter((one) => Boolean(one) && !one.startsWith('#'));
  }

  let found = excludeCache.includes(iam);

  if (found) {
    return {
      found: true,
      reason: 'iam',
      data: iam,
    };
  }

  found = excludeCache.find((one) => parents.includes(one));

  if (found) {
    return {
      found: true,
      reason: 'parent',
      data: found,
    };
  }

  return {
    found: false,
  };
};

exports.getIO = () => sockets.io;
