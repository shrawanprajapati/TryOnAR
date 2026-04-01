const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'db.json');

function ensureDb() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(
      dbPath,
      JSON.stringify(
        {
          users: [],
          sessions: [],
        },
        null,
        2
      )
    );
  }
}

function readDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

function writeDb(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

function normalizeEmail(email) {
  return String(email || '')
    .trim()
    .toLowerCase();
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(String(password || '')).digest('hex');
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function buildDefaultSnapshots(userName) {
  return [
    {
      id: 'snap-1',
      title: `${userName.split(' ')[0] || 'User'} Try-On Session`,
      subtitle: 'Eyewear fit preview',
    },
    {
      id: 'snap-2',
      title: 'Living Room Placement',
      subtitle: 'Lamp placement scene',
    },
    {
      id: 'snap-3',
      title: 'Catalog Review',
      subtitle: 'Product shortlist from the latest browse',
    },
  ];
}

function createUser({ name, email, password, role }) {
  const db = readDb();
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !String(password || '').trim()) {
    throw new Error('Email and password are required.');
  }

  const existingUser = db.users.find((user) => user.email === normalizedEmail);

  if (existingUser) {
    throw new Error('An account with this email already exists.');
  }

  const now = new Date().toISOString();
  const safeName =
    String(name || '')
      .trim()
      .slice(0, 60) || normalizedEmail.split('@')[0] || 'TryOnAR User';

  const newUser = {
    id: crypto.randomUUID(),
    name: safeName,
    email: normalizedEmail,
    role: String(role || '').trim() || 'AR Creator',
    passwordHash: hashPassword(password),
    createdAt: now,
    updatedAt: now,
    snapshots: buildDefaultSnapshots(safeName),
  };

  db.users.push(newUser);
  writeDb(db);

  return sanitizeUser(newUser);
}

function authenticateUser({ email, password }) {
  const db = readDb();
  const normalizedEmail = normalizeEmail(email);
  const passwordHash = hashPassword(password);

  const user = db.users.find(
    (entry) => entry.email === normalizedEmail && entry.passwordHash === passwordHash
  );

  if (!user) {
    throw new Error('Invalid email or password.');
  }

  return sanitizeUser(user);
}

function createSession(userId) {
  const db = readDb();
  const user = db.users.find((entry) => entry.id === userId);

  if (!user) {
    throw new Error('User not found.');
  }

  db.sessions = db.sessions.filter((entry) => entry.userId !== userId);

  const session = {
    token: crypto.randomUUID(),
    userId,
    createdAt: new Date().toISOString(),
  };

  db.sessions.push(session);
  writeDb(db);

  return {
    token: session.token,
    user: sanitizeUser(user),
  };
}

function getSessionFromToken(token) {
  const db = readDb();
  const session = db.sessions.find((entry) => entry.token === token);

  if (!session) {
    return null;
  }

  const user = db.users.find((entry) => entry.id === session.userId);

  if (!user) {
    return null;
  }

  return {
    token: session.token,
    user,
  };
}

function deleteSession(token) {
  const db = readDb();
  const nextSessions = db.sessions.filter((entry) => entry.token !== token);
  db.sessions = nextSessions;
  writeDb(db);
}

function updateUser(userId, updates) {
  const db = readDb();
  const user = db.users.find((entry) => entry.id === userId);

  if (!user) {
    throw new Error('User not found.');
  }

  if (typeof updates.name === 'string' && updates.name.trim()) {
    user.name = updates.name.trim().slice(0, 60);
  }

  if (typeof updates.email === 'string' && updates.email.trim()) {
    const normalizedEmail = normalizeEmail(updates.email);
    const emailTaken = db.users.some(
      (entry) => entry.id !== userId && entry.email === normalizedEmail
    );

    if (emailTaken) {
      throw new Error('This email is already being used by another account.');
    }

    user.email = normalizedEmail;
  }

  if (typeof updates.role === 'string' && updates.role.trim()) {
    user.role = updates.role.trim().slice(0, 40);
  }

  user.updatedAt = new Date().toISOString();
  writeDb(db);

  return sanitizeUser(user);
}

function getWorkspacePayload(userId, products) {
  const db = readDb();
  const user = db.users.find((entry) => entry.id === userId);

  if (!user) {
    throw new Error('User not found.');
  }

  return {
    models: products
      .filter((product) => product.modelSlug)
      .map((product) => ({
        id: product.id,
        title: product.name,
        category: product.category,
        imageUrl: product.imageUrl,
        modelSlug: product.modelSlug,
      })),
    snapshots: user.snapshots || buildDefaultSnapshots(user.name),
  };
}

module.exports = {
  authenticateUser,
  createSession,
  createUser,
  deleteSession,
  getSessionFromToken,
  getWorkspacePayload,
  sanitizeUser,
  updateUser,
};
