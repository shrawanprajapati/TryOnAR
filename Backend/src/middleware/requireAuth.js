const { getSessionFromToken, sanitizeUser } = require('../data/store');

module.exports = function requireAuth(req, res, next) {
  const authorization = String(req.headers.authorization || '');
  const token = authorization.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length).trim()
    : '';

  if (!token) {
    return res.status(401).json({ message: 'Missing authentication token.' });
  }

  const session = getSessionFromToken(token);

  if (!session) {
    return res.status(401).json({ message: 'Session expired or invalid.' });
  }

  req.authToken = token;
  req.user = sanitizeUser(session.user);
  return next();
};
