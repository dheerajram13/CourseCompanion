const admin = require('firebase-admin');
const serviceAccount = require('./firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://coursecompanion-de8fa.appspot.com", 
  databaseURL: "https://coursecompanion-de8fa-default-rtdb.firebaseio.com/"
});

const bucket = admin.storage().bucket("gs://coursecompanion-de8fa.appspot.com");
const db = admin.database();

// Test bucket access
bucket.exists().then((data) => {
  const exists = data[0];
  console.log(`Bucket exists: ${exists}`);
}).catch((error) => {
  console.error('Error checking bucket:', error);
});

module.exports = { admin, bucket, db };