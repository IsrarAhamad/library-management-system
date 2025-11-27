// Generic required fields checker for Express routes
function requireFields(fields) {
  return (req, res, next) => {
    for (let field of fields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }
    next();
  };
}

module.exports = { requireFields };
