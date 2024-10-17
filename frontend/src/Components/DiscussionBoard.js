import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, TextField, Button, Paper } from '@mui/material';
import config from '../config';
const DiscussionBoard = ({ courseId, uid }) => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const baseURL = config.baseUrl;

    useEffect(() => {
        fetchPosts();
    }, [courseId]);

    const fetchPosts = async () => {
        try {
            const response = await fetch(`${baseURL}/courses/${courseId}/discussion`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ uid })
            });

            if (response.ok) {
                const data = await response.json();
                setPosts(data.posts);
            } else {
                console.error('Failed to fetch discussion posts');
            }
        } catch (error) {
            console.error('Error fetching discussion posts:', error);
        }
    };

    const handleSubmitPost = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${baseURL}/courses/${courseId}/discussion/post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ uid, content: newPost })
            });

            if (response.ok) {
                setNewPost('');
                fetchPosts();
            } else {
                console.error('Failed to submit post');
            }
        } catch (error) {
            console.error('Error submitting post:', error);
        }
    };

    return (
        <Paper elevation={2} sx={{ p: 2 }}>
            <List>
                {posts.map((post, index) => (
                    <ListItem key={index} divider>
                        <ListItemText 
                            primary={post.content}
                            secondary={`Posted by ${post.authorName} on ${new Date(post.timestamp).toLocaleString()}`}
                        />
                    </ListItem>
                ))}
            </List>
            <form onSubmit={handleSubmitPost}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Write your post here..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    margin="normal"
                />
                <Button type="submit" variant="contained" color="primary">
                    Post
                </Button>
            </form>
        </Paper>
    );
};

export default DiscussionBoard;