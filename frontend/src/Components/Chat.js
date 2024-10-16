import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from '../firebaseConfig';
import { Button, TextField, Typography, Box, Paper } from '@mui/material';

const Chat = ({ uid, recipient, recipientName, closeChat }) => {
    console.log('Chat component rendered with:', { uid, recipient, recipientName });
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        if (!uid || !recipient) {
            console.error('Missing uid or recipient:', { uid, recipient });
            return;
        }

        // Query to get messages involving both the current user and recipient
        const q = query(
            collection(db, "messages"),
            where("participants", "array-contains", uid)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const msgs = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                // Ensure the message is between the current user and recipient
                if (
                    (data.sender === uid && data.recipient === recipient) ||
                    (data.sender === recipient && data.recipient === uid)
                ) {
                    msgs.push(data);
                }
            });
            // Sort messages by timestamp and update state
            setMessages(msgs.sort((a, b) => a.timestamp.toMillis() - b.timestamp.toMillis()));
        });

        return () => unsubscribe();
    }, [recipient, uid]);

    const sendMessage = async () => {
        if (!newMessage.trim() || !uid || !recipient) {
            console.error('Cannot send message. Missing data:', { newMessage: newMessage.trim(), uid, recipient });
            return;
        }
    
        try {
            const docRef = await addDoc(collection(db, "messages"), {
                sender: uid,
                recipient: recipient,
                content: newMessage,
                timestamp: Timestamp.now(),
                participants: [uid, recipient] 
            });
            console.log("Message saved with ID:", docRef.id); 
            setNewMessage(''); 
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };
    

    return (
        <Box>
            <Typography variant="h6">Chat with {recipientName}</Typography>
            <Button variant="outlined" onClick={closeChat} style={{ float: 'right' }}>
                Close
            </Button>
            <Paper style={{ maxHeight: 300, overflow: 'auto', padding: '10px', marginTop: '20px' }}>
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <Typography key={index}>
                            <strong>{msg.sender === uid ? 'You' : recipientName}:</strong> {msg.content}
                        </Typography>
                    ))
                ) : (
                    <Typography>No messages yet</Typography>
                )}
            </Paper>
            <TextField
                fullWidth
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                style={{ marginTop: '10px' }}
            />
            <Button variant="contained" onClick={sendMessage} style={{ marginTop: '10px' }}>
                Send
            </Button>
        </Box>
    );
};

export default Chat;
