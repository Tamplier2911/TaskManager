const sanitizeFields = (body, fields) => {
  const sanitized = {};
  for (let field of fields) {
    if (body[field]) sanitized[field] = body[field];
  }
  return sanitized;
};

module.exports = sanitizeFields;
