const admin = require('firebase-admin');

function assertFirebaseEnv(name, value) {
  if (!value || value.includes('your_')) {
    throw new Error(`Missing ${name} in Backend/.env.`);
  }
}

function getFirebaseApp() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

  assertFirebaseEnv('FIREBASE_PROJECT_ID', FIREBASE_PROJECT_ID);
  assertFirebaseEnv('FIREBASE_CLIENT_EMAIL', FIREBASE_CLIENT_EMAIL);
  assertFirebaseEnv('FIREBASE_PRIVATE_KEY', FIREBASE_PRIVATE_KEY);

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

function getAdminAuth() {
  getFirebaseApp();
  return admin.auth();
}

module.exports = {
  getAdminAuth,
};
