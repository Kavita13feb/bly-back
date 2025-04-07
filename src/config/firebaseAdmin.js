const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccount = require('./firebase-admin-key.json'); // Ensure this is secure

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
