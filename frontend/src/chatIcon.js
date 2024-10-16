import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from './firebaseConfig';
import './chatIcon.css';
import Chat from './Components/Chat';
import { Avatar, Divider } from '@mui/material';
import Avataaars from 'avataaars'; 

import { getDatabase, ref, get } from "firebase/database";


const ChatIcon = ({ uid }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [recentChats, setRecentChats] = useState([]);

    const toggleChatList = () => {
        setIsOpen(!isOpen);
    };

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setIsOpen(false);
    };

    const fetchUserName = async (userId) => {
        try {
            const db = getDatabase();
            const userRef = ref(db, `users/${userId}`);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                console.log(`User found: ${snapshot.val()}`); // Log user data
                return snapshot.val().name || 'Anonymous';
            } else {
                console.log(`User with ID ${userId} does not exist.`); // Log if user doesn't exist
            }
        } catch (error) {
            console.error("Error fetching user name:", error);
        }
        return 'Anonymous'; // Default name if user doesn't exist
    };
    

    const fetchRecentChats = async () => {
        try {
            const q = query(
                collection(db, "messages"),
                where("participants", "array-contains", uid)
            );
            const querySnapshot = await getDocs(q);
            
            const users = new Map();  // Use a Map to track unique users by their ID
        
            const userPromises = querySnapshot.docs.map(async doc => {
                const data = doc.data();
                const otherUserId = data.sender === uid ? data.recipient : data.sender;
                
                if (!users.has(otherUserId)) {  // Check if the user has already been added
                    const userName = await fetchUserName(otherUserId);
                    console.log(`Adding user: ID=${otherUserId}, Name=${userName}`); // Log added user
                    users.set(otherUserId, { id: otherUserId, name: userName, avatarId: otherUserId });
                }
            });
        
            await Promise.all(userPromises);
            setRecentChats(Array.from(users.values()));  // Convert Map to an array of values
        } catch (error) {
            console.error("Error fetching recent chats: ", error);
        }
    };
    
    

    useEffect(() => {
        if (uid) {
            fetchRecentChats();
        }
    }, [uid]);

    const closeChatWindow = () => {
        setSelectedUser(null);
    };

    return (
        <div className="chat-container">
            <button className="chat-icon" onClick={toggleChatList}>
                💬
            </button>
            {isOpen && (
                <div className="user-list">
                    <h3>Recent Chats</h3>
                    <ul>
                        {recentChats.length > 0 ? (
                            recentChats.map(user => (
                                <li key={user.id} onClick={() => handleUserSelect(user)} className="chat-list-item">
                                    <Avatar>
                                        <Avataaars style={{ width: '40px', height: '40px' }} avatarStyle='Circle' />
                                    </Avatar>
                                    <span>{user.name}</span>
                                    <Divider sx={{ my: 1 }} />
                                </li>
                            ))
                        ) : (
                            <li>No recent chats</li>
                        )}
                    </ul>
                </div>
            )}
            {selectedUser && (
                <div className="chat-window">
                    <Chat uid={uid} recipient={selectedUser.id} recipientName={selectedUser.name} closeChat={closeChatWindow} />
                </div>
            )}
        </div>
    );
};

export default ChatIcon;
