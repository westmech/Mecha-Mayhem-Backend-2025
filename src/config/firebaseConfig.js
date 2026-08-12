const admin = require('firebase-admin');
const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
  throw new Error(
    "Missing Firebase credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and " +
    "FIREBASE_PRIVATE_KEY."
  );
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_CLIENT_EMAIL,
    privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
  storageBucket: 'gs://mecha-mayhem-2024.appspot.com',
});

// Initialize Firestore
const db = admin.firestore();

module.exports = { db };