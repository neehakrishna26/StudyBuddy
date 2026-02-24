// Middleware to validate required fields
const validateFields = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = [];
    
    for (const field of requiredFields) {
      if (!req.body[field] || req.body[field].toString().trim() === '') {
        missingFields.push(field);
      }
    }
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing or empty required fields: ${missingFields.join(', ')}`
      });
    }
    
    next();
  };
};

module.exports = { validateFields };
