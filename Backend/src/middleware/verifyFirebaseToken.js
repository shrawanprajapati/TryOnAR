const { getAdminAuth } = require('../config/firebaseAdmin');

async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Missing Firebase ID token.' });
  }

  try {
    const decodedToken = await getAdminAuth().verifyIdToken(token);
    req.user = decodedToken;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid Firebase token.', error: error.message });
  }
}

module.exports = {
  verifyFirebaseToken,
};
