const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const db = admin.firestore();

const authenticateUser = (req, res, next) => {
    const { uid } = req.body;
    if (!uid) {
        return res.status(403).json({ error: 'User not authenticated' });
    }
    next();
};

router.post('/recent-chats', authenticateUser, async (req, res) => {
    const { uid } = req.body;

    try {
        const messagesRef = db.collection('messages');
        const snapshot = await messagesRef
            .where('participants', 'array-contains', uid) 
            .get();

        const userMessages = [];
        snapshot.forEach(doc => {
            userMessages.push(doc.data());
        });

        const recentChats = new Set();
        userMessages.forEach(msg => {
            if (msg.sender !== uid) {
                recentChats.add(msg.sender);
            } else if (msg.recipient !== uid) {
                recentChats.add(msg.recipient);
            }
        });

        const recentChatList = Array.from(recentChats).map(userId => ({
            id: userId,
            name: `User ${userId}`
        }));

        res.json({ recentChats: recentChatList });

    } catch (error) {
        console.error('Error fetching recent chats:', error);
        res.status(500).json({ error: 'Error fetching recent chats' });
    }
});

router.post('/messages', authenticateUser, async (req, res) => {
    const { uid, recipient } = req.body;

    try {
        const messagesRef = db.collection('messages');
        const snapshot = await messagesRef
            .where('participants', 'array-contains', uid)
            .get();

        const userMessages = [];
        snapshot.forEach(doc => {
            const message = doc.data();
            if (
                (message.sender === uid && message.recipient === recipient) ||
                (message.sender === recipient && message.recipient === uid)
            ) {
                userMessages.push(message);
            }
        });

        res.json({ messages: userMessages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Error fetching messages' });
    }
});

router.post('/send', authenticateUser, async (req, res) => {
    const { uid, message, recipient } = req.body;

    try {
        const newMessage = {
            sender: uid,
            recipient,
            content: message,
            timestamp: admin.firestore.Timestamp.now(),
            participants: [uid, recipient]
        };

        await db.collection('messages').add(newMessage);

        res.status(201).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Error sending message' });
    }
});

module.exports = router;