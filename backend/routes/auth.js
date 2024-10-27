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
      displayName: name, 
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
   
        const userRecord = await admin.auth().getUserByEmail(email);
        res.status(200).json({ message: 'Login successful', uid: userRecord.uid });
    } catch (error) {
        res.status(400).json({ message: 'Error logging in', error: error.message });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    res.status(200).json({ message: 'User logged out successfully' });
});

module.exports = router;