import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import config from '../config';  




const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        console.log(config.baseUrl);
        const signupURL = config.baseUrl + '/auth/signup'; 
        console.log(signupURL, typeof(signupURL));
        try {
            const response = await fetch(signupURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(`User created successfully! UID: ${data.uid}`);
                setName('');
                setEmail('');
                setPassword('');
            } else {
                setMessage(`Error: ${data.error || 'Unknown error occurred'}`);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, margin: 'auto' }}>
            <Typography variant="h4" gutterBottom>Signup</Typography>
            <form onSubmit={handleSignup}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        fullWidth
                    />
                    <Button 
                        type="submit"
                        variant="contained" 
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Signup
                    </Button>
                </Box>
            </form>
            {message && (
                <Typography 
                    color={message.startsWith('Error') ? 'error.main' : 'success.main'} 
                    sx={{ mt: 2 }}
                >
                    {message}
                </Typography>
            )}
        </Paper>
    );
};

export default Signup;