import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container, Typography, Box, Paper, AppBar, Toolbar, Tabs, Tab, IconButton, Menu, MenuItem } from '@mui/material';
import { AccountCircle, School } from '@mui/icons-material'; 
import Signup from './Components/Signup';
import Login from './Components/Login';
import CourseManager from './Components/CourseManager';
import CourseDetailPage from './Components/CourseDetailPage';
import ChatIcon from './chatIcon';

const App = () => {
    const [uid, setUid] = useState(null);
    const [tabIndex, setTabIndex] = useState(1);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleLoginSuccess = (userUid) => {
        setUid(userUid); 
    };

    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        setUid(null);
        setAnchorEl(null);
    };

    return (
        <Router>
            <AppBar position="static" color="primary" sx={{ width: '100%' }}>
                <Toolbar>
                    <School fontSize="large" sx={{ mr: 2 }} />
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Course Companion
                    </Typography>
                    {uid ? (
                        <div>
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle fontSize="large" />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </div>
                    ) : (
                        <AccountCircle fontSize="large" />
                    )}
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg">
                <Box sx={{ mt: 4, p: 2, textAlign: 'center' }}>
                    <Routes>
                        <Route path="/" element={
                            !uid ? (
                                <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
                                    <Typography variant="h4" gutterBottom>
                                        Welcome to Course Companion
                                    </Typography>
                                    <Tabs 
                                        value={tabIndex} 
                                        onChange={handleTabChange} 
                                        centered 
                                        indicatorColor="primary"
                                        textColor="primary"
                                    >
                                        <Tab label="Signup" />
                                        <Tab label="Login" />
                                    </Tabs>
                                    <Box sx={{ mt: 2 }}>
                                        {tabIndex === 0 && <Signup />}
                                        {tabIndex === 1 && <Login onLoginSuccess={handleLoginSuccess} />}
                                    </Box>
                                </Paper>
                            ) : (
                                <CourseManager uid={uid} />
                            )
                        } />
                        <Route path="/courses/:courseId" element={<CourseDetailPage uid={uid} />} />
                    </Routes>
                </Box>
                <ChatIcon uid={uid}/>
            </Container>
        </Router>
    );
};

export default App;