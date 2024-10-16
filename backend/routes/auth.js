const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

// User Signup Route
router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }

  try {
    const user = await admin.auth().createUser({
      email,
      password,
      displayName: name, // Set the display name in Firebase Auth
    });

    // Create a user document in the Realtime Database
    await admin.database().ref(`users/${user.uid}`).set({
      email: user.email,
      name: name,
      createdAt: admin.database.ServerValue.TIMESTAMP
    });

    res.status(201).json({ message: 'User created successfully', uid: user.uid });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Logic to authenticate user, usually with Firebase Auth
        const userRecord = await admin.auth().getUserByEmail(email);
        // You may need to validate password here with a different approach, as Firebase Admin SDK doesn't handle passwords directly
        // In a typical setup, you'd use Firebase Authentication to validate the user's password

        res.status(200).json({ message: 'Login successful', uid: userRecord.uid });
    } catch (error) {
        res.status(400).json({ message: 'Error logging in', error: error.message });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    // In a real implementation, you might invalidate the session or token
    res.status(200).json({ message: 'User logged out successfully' });
});

module.exports = router;