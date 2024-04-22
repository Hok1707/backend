const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  const [bearer, actualToken] = token.split(' ');

  if (bearer !== 'Bearer' || !actualToken) {
    return res.status(401).json({ message: 'Unauthorized - Invalid token format' });
  }

  const secretKey = process.env.JWT_SECRET;

  jwt.verify(actualToken, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }

    req.user = {
      userID: decoded.id
    };

    next();
  });
};

module.exports = verifyToken;
