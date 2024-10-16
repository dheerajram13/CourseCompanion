import React from 'react';
import { Box, Typography, Modal, Button } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

const UsersModal = ({ open, handleClose, course, uid, handleChatUser }) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="enrolled-users-modal"
        >
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                <Typography variant="h6" id="enrolled-users-modal">Enrolled Users</Typography>
                {course && (
                    <>
                        <Typography variant="subtitle1">{course.courseTitle}</Typography>
                        <Typography variant="body2">Total Users: {course.userCount}</Typography>
                        {course.users.map((user) => (
                            <div key={user.userId} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <Typography>{user.name} - {user.email}</Typography>
                                {user.userId !== uid && ( // Check if user is not the authenticated user
                                    <Button
                                        onClick={() => handleChatUser(user.userId, user.name)}
                                        style={{ marginLeft: '10px', minWidth: '40px' }}
                                        variant="text"
                                    >
                                        <ChatIcon />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </>
                )}
            </Box>
        </Modal>
    );
};

export default UsersModal;
