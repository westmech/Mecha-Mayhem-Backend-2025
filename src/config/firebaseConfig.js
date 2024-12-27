const admin = require('firebase-admin');
const serviceAccount = require(process.env.FIREBASE_FILE_LOC);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://mecha-mayhem-2024.appspot.com',
});

// Initialize Firestore
const db = admin.firestore();

// Initialize auth
const auth = admin.auth();

module.exports = { db, auth };