/**
 * Get the error message from error object
 * @param {Express.Request} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.getErrorMessage = (err) => {
  console.error(err);
  return err.message;
};
