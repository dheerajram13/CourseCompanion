const admin = require('firebase-admin');
const serviceAccount = require('./firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "", 
  databaseURL: ""
});

const bucket = admin.storage().bucket("");
const db = admin.database();
s
bucket.exists().then((data) => {
  const exists = data[0];
  console.log(`Bucket exists: ${exists}`);
}).catch((error) => {
  console.error('Error checking bucket:', error);
});

module.exports = { admin, bucket, db };