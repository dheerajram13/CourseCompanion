import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import config from '../config';

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const baseURL = config.baseUrl;

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Replace this with your actual API endpoint
            const response = await fetch(`${baseURL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                console.log(result.uid);
                onLoginSuccess(result.uid); // Pass the UID to the parent on successful login
            } else {
                alert(`Login failed: ${result.message}`);
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Login failed due to an error.');
        }
    };

    return (
        <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, margin: 'auto' }}>
            <Typography variant="h4" gutterBottom>Login</Typography>
            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                        Login
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

export default Login;
