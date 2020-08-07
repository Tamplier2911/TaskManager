/**
 * @function sanitizeFields
 * @param {object} body - body object recieved from client
 * @param {array} fields - array of fields we want to retrieve e.g. ["name", "email"]
 */

const sanitizeFields = (body, fields) => {
  const sanitized = {};
  for (let field of fields) {
    if (body[field] || body[field] === false || body[field] === 0)
      sanitized[field] = body[field];
  }
  return sanitized;
};

module.exports = sanitizeFields;
